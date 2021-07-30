import { lawDisplay } from "@/generator/law";
import { lawByNumber, vote } from "@/service/lawService";
import { register } from "@/service/userService";
import { VoteType } from "@/types";
import { isNumber, parseInt } from "lodash";
import { Flow, registerFlow } from "..";
import { readPayload } from "../payload";
import { askBoolean } from "../util";

const flow: Flow = async (error, send, ask, data, args) => {
  let [numberText] = args;

  if (isNaN(+numberText)) {
    error(`'${numberText}' אינו מספר תקין`);
    return;
  }

  

  if (!numberText)
    numberText = (
      await ask(
        "מה מספר החוק שתרצה להציג עבורו נתונים?",
        (message) => !isNaN(+message.content),
        "זה לא מספר ידידי, נסה שוב"
      )
    ).text;

  const number = +numberText;

  const law = await lawByNumber(number);
  if (!law) {
    error("לא נמצא חוק עם המספר הזה, נסה שוב");
    return;
  }

  send(lawDisplay(law), true, { lawId: law.id });
};

registerFlow(
  {
    memberOnly: true,
    privateOnly: true,
    aliases: ["מצב"],
    identifier: "חוק",
    description: "פקודה בשביל להציג מידע על חוק",
    usage: "$חוק [מספר]",
    name: "מידע על חוק",
  },
  flow
);

