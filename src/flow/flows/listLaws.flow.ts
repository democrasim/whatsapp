import { lawsByStatus } from "@/service/lawService";
import { Flow, registerFlow } from "..";
import { Status } from "types";
import { MessageTypes } from "@open-wa/wa-automate";
import { lawListToTextSimple } from "@/generator/law";

const statusMap: Record<string, Status> = {
  עברו: "PASSED",
  נכשלו: "FAILED",
  בוטלו: "CANCELED",
  נפסלו: "VETOED",
  בהצבעה: "UNDER_VOTE",
};

const flow: Flow = async (error, send, ask, data, args) => {
  let [status, page] = args;

  if (!(status in statusMap)) {
    error("זה לא מצב חוק מתאים");
  }

  if (!status || !(status in statusMap)) {
    status = (
      await ask(
        `איזה מצב חוק תרצה להציג`,
        MessageTypes.BUTTONS_RESPONSE,
        undefined,
        undefined,
        Object.keys(statusMap),
        "",
        "יש ללחוץ על הכפתור המתאים"
      )
    ).text;
  }

  if (!(status in statusMap)) {
    error("ולק עזוב");
    return;
  }

  const laws = (await lawsByStatus(statusMap[status]))!;

  send(
    `תפיק מבט בחוקים ש${status}
${lawListToTextSimple(laws)}

מציג ${laws.length} חוקים
`,
    false,
    undefined,
    true
  );
};

registerFlow(
  {
    memberOnly: true,
    privateOnly: false,
    aliases: ["חו"],
    identifier: "חוקים",
    description: "פקודה בשביל להציג רשימת חוקים",
    usage: "$חוקים [עברו/נכשלו/בהצבעה/נפסלו/בוטלו]",
    name: "מידע על חוק",
  },
  flow
);
