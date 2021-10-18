import { propose } from "@/service/lawService";
import { fetchAllMembers, fetchMemberByName } from "@/service/userService";
import {
  Content,
  ContentType,
  Law,
  LawPropostion,
  Member,
  PunishmentType,
} from "@/types";
import { MessageId, MessageTypes } from "@open-wa/wa-automate";
import { text } from "express";
import { Flow, RegisteredFlow, registerFlow } from "..";
import { askBoolean, askOptional } from "../util";

const flow: Flow = async (error, send, ask, data) => {
  const { member } = data;

  const types: Record<string, ContentType> = {
    עובדה: "FACT",
    איסור: "BAN",
    חובה: "REQUIREMENT",
    גירוש: "REMOVE_MEMBER",
  };

  const punishments: Record<string, PunishmentType> = {
    גירוש: "BAN",
  };

  const typeList = Object.keys(types);
  const punishmentsTypes = Object.keys(punishments);

  const typesString = typeList.reduce(
    (prev, current) => prev + "\n" + current,
    ""
  );
  const punishmentsString = punishmentsTypes.reduce(
    (str, current) => str + "\n" + current,
    ""
  );

  let { text: name, original } = await askOptional(ask, "תן שם לחוק", "תרצה לתת שם לחוק?");
  if (name === ",") name = "";

  let { choice: anonymous } = await askBoolean(ask, `תרצה חוק ממקור אנונימי?`);

  const contents = [];

  let addingContent = true;

  while (addingContent) {
    const { text: type, original } = await ask(
      "איזה סוג של סעיף תרצה להוסיף?",
      MessageTypes.BUTTONS_RESPONSE,
      undefined,
      undefined,
      Object.keys(types),
      "",
      ""
    );

    const content: Content = {
      type: types[type],
    };

    if (["FACT", "BAN", "REQUIREMENT"].includes(types[type])) {
      let { text: description } = await ask(`בבקשה תן תיאור לסעיף הזה`,MessageTypes.TEXT);

      content.description = description;
    }
    if ("REMOVE_MEMBER" === types[type]) {
      let members: Member[] = (await fetchAllMembers())!;
      let { text: removedMemberName } = await ask("את מי תרצה להעיף?",
        MessageTypes.BUTTONS_RESPONSE,
        undefined,
        undefined,
        members.map(member=>member.name),
        "","");
      let removedMember = members.find(
        (member) => member.name === removedMemberName
      );
      content.member = removedMember;
    }
    if (["BAN", "REQUIREMENT"].includes(types[type])) {
      const { text: punishment } = await ask(
        "איזה סוג של סעיף תרצה להוסיף?",
  MessageTypes.BUTTONS_RESPONSE,
        undefined,
        undefined,
        punishmentsTypes,
        "",
        ""
      );
      content.punishment = {
        type: punishments[punishment],
      };
    }

    contents.push(content);

    const { choice } = await askBoolean(ask, "תרצה להוסיף עוד סעיף?");
    addingContent = choice;
  }

  const lawProposition: LawPropostion = {
    anonymous,
    content: contents,
    legislator: member!.id,
    title: name ?? "",
  };

  const law = await propose(lawProposition);

  if (!law) error("וואלה לא הלך, מוזר");

  await send("זהו, החוק הוצע עם מספר " + law!.number);
  return;
};

registerFlow(
  {
    memberOnly: true,
    privateOnly: true,
    identifier: "הצע",
    description: "הצעת חוק",
    name: "הצעת חוק",
  },
  flow
);
