import { fetchMemberByPhone, fetchMemberByWhatsAppId } from "@/service/userService";
import { Member } from "@/types";
import { ChatId, Client, Contact, ContactId, Message, MessageId, MessageTypes } from "@open-wa/wa-automate";
import clientModule from "..";
import fs from 'fs';
import path from 'path';

export interface Response {
    response: Message,
    original: MessageId
    text: string;
}

export interface FlowOptions {
    identifier: string;
    privateOnly: boolean;
    memberOnly: boolean;
    name?: string;
    usage?: string;
    description?: string;

}

export interface FlowClass {
    flow: Flow;
}

export interface RegisteredFlow {
    options: FlowOptions,
    flow: Flow
}

interface FlowStore {
    flows: RegisteredFlow[]
}

interface FlowData {
    member?: Member,
    contact: Contact,
    messageId: MessageId
}

const flowStore: FlowStore = {
    flows: []
};

export type AskCall = (content: string, check?: (message: Message) => boolean, error?: string) => Promise<Response>

export type Flow = (error: (content: string) => Promise<void>, send: (content: string) => Promise<MessageId>, ask: AskCall, data: FlowData) => void;

export async function sendResponse(client: Client, messageId: MessageId, chatId: ChatId, content: string): Promise<MessageId> {
    return await client.reply(chatId, content, messageId) as MessageId;

}

export async function awaitResponse(client: Client, chatId: ChatId, userId: ContactId, messageId: MessageId, content: string, check?: (message: Message) => boolean, error?: string): Promise<Response> {

    const message = await sendResponse(client, messageId, chatId, content);


    const collector = client.createMessageCollector(chatId, (received: Message) =>
        received.type === MessageTypes.TEXT
        && !!received.quotedMsg
        && received.sender.id === userId
        && received.quotedMsg.id === message, {

    });

    return await new Promise((resolve) => {

        collector.on('collect', (collected: Message) => {
            console.log('Collected message with id ' + collected.id);

            if (check && !check(collected)) {
                if (!error) {
                    error = 'קלט לא תקין אנא נסה שוב'
                }
                sendError(client, collected, error);

            } else {

                collector.stop();
                resolve({
                    response: collected,
                    original: message,
                    text: collected.content
                });
            }
        })
    })

}

export async function sendError(client: Client, message: Message, error: string) {


    await client.reply(message.chatId, `⚠️ ${error}`, message.id);
}

export const registerFlow = (options: FlowOptions, flow: Flow) => {

    flowStore.flows.push({ flow, options });
}

export function initFlows() {
    const { client } = clientModule
    if (!client) return;

    const normalizedPath = path.join(__dirname, 'flows');

    fs.readdirSync(normalizedPath).forEach(file => {
        console.log('Loading ' + file)
        require('./flows/' + file);
        console.log('Loaded ' + file);
    })

    client.onAnyMessage((message: Message) => recieveFlow(message, client));
}

async function recieveFlow(message: Message, client: Client) {
    const found = flowStore.flows.find(flow => message.type === MessageTypes.TEXT && `$${flow.options.identifier}` === message.content)
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
        sendError(client, message, `אינך משתמש רשום, על מנת להירשם השתמש ב \`$הרשמה שם\` בפרטי`)
        return;
    }

    let lastMessageId = message.id;

    flow(
        async (content) => await sendError(client, message, content),
        async (content) => lastMessageId = await sendResponse(client, lastMessageId, message.chatId, content),
        async (content, check, error) => {
            const response = (await awaitResponse(client, message.chatId, message.sender.id, lastMessageId, content, check, error));
            lastMessageId = response.response.id;
            return response;
        },
        {
            contact: message.sender,
            messageId: message.id,
            member
        });
}
