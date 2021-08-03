import { Member } from "@/types";

export function displayMemberList(list: Member[]) {
  const regsiteredEmoji = (registered: boolean) => (registered ? "🙎🏻‍♂️" : "👤");

  let response = `רשימת חברי מועצה
${regsiteredEmoji(true)} - חבר רשום
${regsiteredEmoji(false)} - חבר לא רשום

`;

  list.forEach((member) => {
    response += `
${member.name} ${regsiteredEmoji(member.registered)}`;
  });

  return response;
}

export function displayMembersNames(members:Member[]){
  return members.map((members)=>members.name).join("\n");
}