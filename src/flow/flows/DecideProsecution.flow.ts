import {
  decideProsecution,
  getJudge,
  getProsecutionByGroup,
} from "@/service/courtService";
import { vote } from "@/service/lawService";
import { register } from "@/service/userService";
import { VoteType } from "@/types";
import { Flow, registerFlow } from "..";
import { readPayload } from "../payload";
import { askBoolean } from "../util";

const flow: Flow = async (error, send, ask, data, args) => {
  let decisionText = data.content.split(" ")[0];

  if (decisionText === "החלטה") {
    if (!args) error("blabla");
    [decisionText] = args;
  }

  const decisionToType: Record<string, boolean> = {
    התקבל: true,
    נדחה: false,
  };

  const judge = await getJudge();
  if (data.member!.phone === judge!.phone + "@c.us") {
    error("פקודה זמינה רק לשופט");
    return;
  }

  const decision = decisionToType[decisionText];
  let prosecution = await getProsecutionByGroup(data.groupId);
  if (!prosecution) {
    error("זוהי לא קבוצה של תביעה");
  }
  decideProsecution(prosecution!, decision);
};

registerFlow(
  {
    memberOnly: true,
    privateOnly: false,
    aliasWithDollar: false,
    aliases: ["התקבל", "נדחה"],
    identifier: "החלטה",
    description: "פקודה בשביל להכריע תביעה",
    usage: "$בעד/נגד/נמנע",
    name: "החלטה",
  },
  flow
);
