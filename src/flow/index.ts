import {
  fetchMemberByPhone,
  fetchMemberByWhatsAppId,
} from "@/service/userService";
import { Member } from "@/types";
import {
  ChatId,
  Client,
  Contact,
  ContactId,
  Message,
  MessageId,
  MessageTypes,
} from "@open-wa/wa-automate";
import clientModule from "..";
import fs from "fs";
import path from "path";
import { Page } from "puppeteer";
import { sendPayloaded, writePayload } from "./payload";

const selfChat = "17622130901@c.us";

export interface Response {
  response: Message;
  original: MessageId;
  text: string;
}

export interface FlowOptions {
  aliasWithDollar?: boolean;
  identifier: string;
  privateOnly: boolean;
  memberOnly: boolean;
  aliases?: string[];
  name?: string;
  usage?: string;
  description?: string;
}

export interface RegisteredFlow {
  options: FlowOptions;
  flow: Flow;
}

interface FlowStore {
  flows: RegisteredFlow[];
}

interface FlowData {
  content: string;
  member?: Member;
  quoted?: Message;
  contact: Contact;
  messageId: MessageId;
}

const flowStore: FlowStore = {
  flows: [],
};

export type AskCall = (
  content: string,
  check?: (message: Message) => boolean,
  error?: string,
  buttons?: string[],
  title?: string,
  footer?: string
) => Promise<Response>;

export type Flow = (
  error: (content: string) => Promise<void>,
  send: (
    content: string,
    privately?: boolean,
    payload?: any
  ) => Promise<MessageId>,
  ask: AskCall,
  data: FlowData,
  args: string[]
) => void;

export function getFlows() {
  return flowStore.flows;
}

export async function sendResponse(
  client: Client,
  messageId: MessageId,
  chatId: ChatId,
  content: string,
  payload?: {}
): Promise<MessageId> {
  if (payload) {
    sendPayloaded(content, payload, chatId);
    return messageId;
  }
  return (await client.reply(chatId, content, messageId)) as MessageId;
}

export async function awaitResponse(
  client: Client,
  chatId: ChatId,
  userId: ContactId,
  messageId: MessageId,
  content: string,
  check?: (message: Message) => boolean,
  error?: string,
  buttons?: string[],
  title?: string,
  footer?: string
): Promise<Response> {
  let sentId: MessageId;
  if (buttons) {
    sentId = (await client.sendButtons(
      chatId,
      content,
      buttons.map((button, i) => {
        return {
          text: button,
          id: "" + i,
        };
      }),
      title!,
      footer
    )) as MessageId;
  } else {
    const message = await sendResponse(client, messageId, chatId, content);
    sentId = message;
  }
  const collector = client.createMessageCollector(
    chatId,
    (received: Message) =>
      received.type === MessageTypes.TEXT &&
      !!received.quotedMsg &&
      received.sender.id === userId &&
      received.quotedMsg.id === sentId,
    {}
  );

  return await new Promise((resolve) => {
    collector.on("collect", (collected: Message) => {
      console.log("Collected message with id " + collected.id);

      if (check && !check(collected)) {
        if (!error) {
          error = "קלט לא תקין אנא נסה שוב";
        }
        sendError(client, collected, error);
      } else {
        collector.stop();
        resolve({
          response: collected,
          original: sentId,
          text: collected.content,
        });
      }
    });
  });
}

export async function sendError(
  client: Client,
  message: Message,
  error: string
) {
  await client.reply(message.chatId, `⚠️ ${error}`, message.id);
}

export const registerFlow = (options: FlowOptions, flow: Flow) => {
  flowStore.flows.push({
    flow,
    options: Object.assign(
      {
        aliasWithDollar: true,
        memberOnly: false,
        privateOnly: false,
        aliases: [],
        identifier: "",
        name: "",
        usage: "",
        description: "",
      } as FlowOptions,
      options
    ),
  });
};

export function initFlows() {
  const { client } = clientModule;
  if (!client) return;

  const normalizedPath = path.join(__dirname, "flows");

  fs.readdirSync(normalizedPath)
    .filter((file) => file.includes("flow"))
    .forEach((file) => {
      console.log("Loading " + file);

      require("./flows/" + file);
      console.log("Loaded " + file);
    });

  client.onAnyMessage((message: Message) => recieveFlow(message, client));
}

function isFlow(flow: RegisteredFlow, message: Message) {
  const start = `${flow.options.identifier}`;
}

async function recieveFlow(message: Message, client: Client) {
  if (message.type !== MessageTypes.TEXT) return;

  const [identifier, ...args] = message.content.split(" ");

  const found = flowStore.flows.find(
    (flow) =>
      message.type === MessageTypes.TEXT &&
      (`$${flow.options.identifier}` === identifier ||
        (flow.options.aliases &&
          flow.options.aliases.forEach(
            (alias) =>
              `${flow.options.aliasWithDollar ? "$" : ""}${alias}` ===
              identifier
          )))
  );
  if (!found) return;
  // this means we found the flow, we can now error.
  const { options, flow } = found;
  if (options.privateOnly && message.isGroupMsg) {
    sendError(client, message, `אפשר להשתמש בפקודה זאת רק בפרטי`);
    return;
  }

  const member = await fetchMemberByWhatsAppId(message.sender.id);

  console.log(member);

  if (options.memberOnly && !member) {
    sendError(
      client,
      message,
      `אינך משתמש רשום, על מנת להירשם השתמש ב \`$הרשמה שם\` בפרטי`
    );
    return;
  }

  let lastMessageId = message.id;

  flow(
    async (content) => await sendError(client, message, content),
    async (content, privately = false, payload) =>
      (lastMessageId = await sendResponse(
        client,
        lastMessageId,
        privately ? message.sender.id : message.chatId,
        content,
        payload
      )),
    async (content, check, error, buttons, title, footer) => {
      const response = await awaitResponse(
        client,
        message.chatId,
        message.sender.id,
        lastMessageId,
        content,
        check,
        error,
        buttons,
        title,
        footer
      );
      lastMessageId = response.response.id;
      return response;
    },
    {
      quoted: message.quotedMsg,
      content: message.content,
      contact: message.sender,
      messageId: message.id,
      member,
    },
    args
  );
}
