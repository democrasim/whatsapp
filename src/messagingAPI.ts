import { Client, ChatId, ContactId } from "@open-wa/wa-automate";
import fetch from "node-fetch";
import express from "express";
import clientModule from ".";
import { sendPayloaded } from "./flow/payload";
import {
  prosecutionExplanation,
  prosecutionGroupName,
} from "./generator/court";
import { lawDoneAnnouncement, lawToTextAnnouncement } from "./generator/law";
import { getJudge } from "./service/courtService";
import { Law, Member, Prosecution } from "./types";

let PORT = process.env.PORT || 8081;
let councilChat =
  (process.env.COUNCIL as ChatId) ?? "972586649222-1628023128@g.us";

export default async function listenToIncomingMessages(client: Client) {
  const app = express();
  app.use(express.json());

  app.post("/finished_law", async (req, res) => {
    let law: Law = req.body;

    console.log("Received finished law with id " + law.id);

    try {
      await sendPayloaded(
        lawDoneAnnouncement(law),
        { lawId: law.id },
        councilChat
      );
      res.sendStatus(200);
    } catch (e) {
      res.sendStatus(503);
    }
  });

  app.post("/new_law", async (req, res) => {
    let law: Law = req.body;

    console.log("Received new law with id " + law.id);

    try {
      await sendPayloaded(
        lawToTextAnnouncement(law),
        { lawId: law.id },
        councilChat
      );
      res.sendStatus(200);
    } catch (e) {
      res.sendStatus(503);
    }
  });

  app.post("/add_member_passed", async (req, res) => {
    const member: Member = req.body;
    clientModule.client!.sendText(
      `${member.phone}@c.us`,
      "החוק להוסיף אותך לדמוקרסים עבר, תצורף בקרוב על ידי מנהל"
    );
    res.sendStatus(200);
  });

  app.post("/add_member_failed", async (req, res) => {
    const member: Member = req.body;
    clientModule.client!.sendText(
      `${member.phone}@c.us`,
      "החוק להוסיף אותך לדמוקרסים נכשל, נתראה בגיהנום"
    );
    res.sendStatus(200);
  });

  app.post("/send_code", async (req, res) => {
    const [code, member]: [string, ContactId] = req.body;

    const sent = await clientModule.client!.sendText(
      `${member}`,
      `הקוד שלך לכניסה לדמוקרסים הוא
${code}

אם זה לא היית אתה, אנא התעלם`
    );

    res.sendStatus(sent ? 200 : 503);
  });

  app.post("/send_message", async (req, res) => {
    let { chatId, message } = req.body;

    console.log(`Requesting ${chatId} with content: ${message}`);

    let sent = await client.sendText(chatId as ChatId, message);
    if (sent) {
      res.sendStatus(200);
    } else {
      res.sendStatus(503);
    }
  });

  app.post("/new_prosecution", async (req, res) => {
    const prosecution: Prosecution = req.body;
    const judge = await getJudge();
    const group = await client.createGroup(
      prosecutionGroupName(prosecution),
      [
        `${prosecution.prosecutor.phone}@c.us`,
        `${prosecution.prosecuted.phone}@c.us`,
        `${judge!.phone}@c.us`
      ]
    );
    let d: any = group.gid;
    client.sendText(d._serialized,prosecutionExplanation(prosecution,judge!))
  });
  app.post("/prosecution_decided", async (req, res) => {
  });
  app.post("/prosecution_appealed", async (req, res) => {});
  app.post("/prosecution_appeal_decided", async (req, res) => {});

  app.listen(PORT, () => {
    console.log("(!) Now listening on port " + PORT);
  });
}
