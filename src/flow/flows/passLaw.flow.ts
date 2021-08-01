import { propose } from "@/service/lawService";
import { fetchAllMembers, fetchMemberByName } from "@/service/userService";
import { Content, ContentType, Law, LawPropostion, Member } from "@/types";
import { MessageId } from "@open-wa/wa-automate";
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

  const typeList = Object.keys(types);

  const typesString = typeList.reduce(
    (prev, current) => prev + "\n" + current,
    ""
  );

  let { text: name, original } = await askOptional(ask, "תן שם חתיך לחוק");
  if (name === ",") name = "";

  let { choice: anonymous } = await askBoolean(ask, `תרצה חוק ממקור אנונימי?`);

  let { text: fakeName } = await askOptional(
    ask,
    "הגב עם שם מזוייף בשביל שם מזוייף לחוק"
  );

  const contents = [];

  let addingContent = true;

  while (addingContent) {
    const { text: type, original } = await ask(
      `איזה סוג של סעיף תרצה להוסיף?
האופציות:
${typesString}`,
      (message) => typeList.includes(message.content),
      `זה לא סוג מותר, אנא נסה שוב`
    );

    const content: Content = {
      type: types[type],
    };

    if (["FACT", "BAN", "REQUIREMENT"].includes(types[type])) {
      let { text: description } = await ask(`בבקשה תן תיאור לסעיף הזה`);

      content.description = description;
    }
    if ("REMOVE_MEMBER" === types[type]) {
      let members: Member[] = (await fetchAllMembers())!;
      let membersText: string = "את מי תרצה להעיף";
      membersText += "?\n";

      for (let i of members) {
        membersText += i.name + "\n";
      }
      let { text: removedMemberName } = await ask(membersText);
      let removedMember = members.find(
        (member) => member.name === removedMemberName
      );
      if (!removedMember) {
        error("משתמש לא קיים");
        return;
      }
      content.member = removedMember;
    }

    contents.push(content);

    const { choice } = await askBoolean(ask, "תרצה להוסיף עוד סעיף?");
    addingContent = choice;
  }

  const lawProposition: LawPropostion = {
    anonymous,
    content: contents,
    fakeName: fakeName ?? "",
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
