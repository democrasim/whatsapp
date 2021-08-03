import { displayMemberList, displayMembersNames } from "@/generator/member";
import { prosecute } from "@/service/courtService";
import { lawByNumber } from "@/service/lawService";
import { fetchAllMembers } from "@/service/userService";
import { Content } from "@/types";
import { Flow, registerFlow } from "..";

const flow: Flow = async (error, send, ask, data, args) => {
  let lawNumberString = (await ask("בעבור איזה חוק תרצה לתבוע?")).text;
  if (isNaN(+lawNumberString)) {
    error(`'${lawNumberString}' אינו מספר תקין`);
    return;
  }
  let lawNumber = +lawNumberString;
  const law = await lawByNumber(lawNumber);
  if (!law) {
    error("לא נמצא חוק עם המספר הזה, נסה שוב");
    return;
  }
  let content: Content;
  let potentialContents = law.content.filter((content) => {
    return content.punishment!;
  });
  if (potentialContents.length == 0) {
    error("בחוק שבחרת אין שום עונש");
    return;
  }
  if (potentialContents.length == 1) {
    content = potentialContents[0];
  } else {
    let possibleContentsString = potentialContents
      .map(
        (content, index) =>
          index.toString() +
          content.description +
          "\n" +
          "עונש: " +
          content.punishment?.type
      )
      .join("\n");
    let selection = (
      await ask(
        "כתוב את מספר הסעיף איתו תרצה לתבוע" + "\n" + possibleContentsString
      )
    ).text;
    if (isNaN(+selection)) {
      error(`'${lawNumberString}' אינו מספר תקין`);
      return;
    }
    content = potentialContents[+selection];
  }
  let members = (await fetchAllMembers())!;
  let prosecutedName = (
    await ask("את מי תרצה לתבוע?" + displayMembersNames(members))
  ).text;
  if (members.filter((member) => member.name === prosecutedName).length === 0) {
    error("לא קיים");
    return;
  }
  let prosecuted = members.filter(
    (member) => member.name === prosecutedName
  )[0];
  let reason = (await ask("מה הסיבה לתביעה?")).text;

  prosecute(
    law.id,
    prosecuted.id,
    data.member?.id!,
    law.content.indexOf(content),
    reason
  );
};

registerFlow(
  {
    name: "תביעה",
    identifier: "תביעה",
    memberOnly: true,
    privateOnly: true,
    description: "מגיש תביעה",
    usage: "$תביעה",
  },
  flow
);
