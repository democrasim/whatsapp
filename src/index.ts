import { create, Client, Message, MessageTypes } from "@open-wa/wa-automate";
import listenToIncomingMessages from "@/messagingAPI";
import * as dotenv from "dotenv";
import { initFlows } from "./flow";
dotenv.config({ path: __dirname + "/.env" });

interface ClientModule {
  client: Client | undefined;
}

const clientModule: ClientModule = { client: undefined };

if (!process.env.API_KEY) {
  console.log("You must create a .env file with an API_KEY set.");

  process.exit();
}

create({
  useChrome: true,
  eventMode: true,
  headless: false,
}).then((client: Client) => {
  clientModule.client = client;
  start(client);
});

function start(client: Client) {
  listenToIncomingMessages(client);
  initFlows();
}

export default clientModule;
