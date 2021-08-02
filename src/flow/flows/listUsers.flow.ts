import { displayMemberList } from "@/generator/member";
import clientModule from "@/index";
import { fetchAllMembers } from "@/service/userService";
import { Flow, registerFlow } from "..";

const flow: Flow = async (error, send, ask, data, args) => {
  const members = await fetchAllMembers();

  if (members) {
    send(displayMemberList(members));
  } else {
    error("לא הצלחתי להשיג רשימת משתמשים, נסה שוב מאוחר יותר");
  }
};

registerFlow(
  {
    name: "רשימת חברים",
    identifier: "רשומים",
    memberOnly: true,
    privateOnly: true,
    description: "מחזיר את רשימת המשתמשים הרשומים",
    usage: "$רשומים",
  },
  flow
);
