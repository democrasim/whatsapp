import { displayMemberList } from "@/generator/member";
import clientModule from "@/index";
import { fetchAllMembers } from "@/service/userService";
import { getLawsUnvoted } from "@/service/lawService";
import { Flow, registerFlow } from "..";
import { lawDisplay, lawToTextAnnouncement } from "@/generator/law";
import { MessageTypes } from "@open-wa/wa-automate";

const flow: Flow = async (error, send, ask, data, args) => {
  let laws = await getLawsUnvoted(data.member!.id);
  console.log(laws);
  send("תצביע, חנון");
  laws!.forEach((law) => {
    ask(
      lawToTextAnnouncement(law),
      MessageTypes.BUTTONS_RESPONSE,
      () => true,
      undefined,
      ["בעד", "נגד", "נמנע"],
      "הצבע על חוק זה",
      "לחץ על הכפתורים פה למטה",
      law.id
    );
  });
};

registerFlow(
  {
    name: "תזכורת",
    identifier: "תזכורת",
    memberOnly: true,
    privateOnly: true,
    aliases: ["$"],
    description: "מחזיר חוקים להגיב עליהם",
    usage: "$תזכורת",
  },
  flow
);
