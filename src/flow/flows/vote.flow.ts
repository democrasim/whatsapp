import clientModule from "@/index";
import { vote } from "@/service/lawService";
import { register } from "@/service/userService";
import { VoteType } from "@/types";
import { MessageTypes } from "@open-wa/wa-automate";
import e from "express";
import { Flow, registerFlow } from "..";
import { readPayload } from "../payload";
import { askBoolean } from "../util";

const flow: Flow = async (error, send, ask, data, args) => {
  let voteText = data.content.split(" ")[0];

  if (voteText === "הצבעה") {
    if (!args) error("blabla");
    [voteText] = args;
  }

  const voteToType: Record<string, VoteType> = {
    בעד: "FOR",
    נמנע: "ABSTAIN",
    נגד: "AGAINST",
  };

  const voteType = voteToType[voteText];

  if (!data.quoted) {
    error("עליך להגיב על משהו בשביל להצביע");
    return;
  }

  const message = await clientModule.client!.getMessageById(data.messageId);

  let lawId = "";
  if (message.type == MessageTypes.BUTTONS_RESPONSE) {
    lawId = message.selectedButtonId;
  } else {
    const payload = (await readPayload(data.quoted?.id)) as { lawId: string };
    lawId = payload.lawId;
  }
  const reason = args.join(" ");

  const result = await vote(data.member!.id, lawId, voteType, reason);

  if (result) {
    send(
      "הצבעתך על חוק " + result?.number + " נקלטה בהצלחה",
      true,
      undefined,
      true
    );
  }
};

registerFlow(
  {
    memberOnly: true,
    privateOnly: false,
    aliasWithDollar: false,
    aliases: ["בעד", "נגד", "נמנע"],
    identifier: "הצבעה",
    description: "פקודה בשביל להצביע",
    usage: "$בעד/נגד/נמנע",
    name: "הצבעה",
  },
  flow
);
