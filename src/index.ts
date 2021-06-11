import { create, Client, Message, MessageTypes } from '@open-wa/wa-automate';
import PassFactLawExecutor from '@executor/PassLawExecutor';
import { Command } from '@command/Command';
import listenToIncomingMessages from '@/messagingAPI';
import CommandExecutor from '@command/CommandExecutor';
import { parseCommand } from '@command/CommandParser';
import CommandTree from '@command/CommandsTree';
import VoteExecutor from '@executor/VoteExecutor';
import * as dotenv from 'dotenv';
import LawListExecutor from '@executor/LawsListExecutor';
import RegisterExecutor from './command/executor/RegisterExecutor';
dotenv.config({ path: __dirname + '/.env' });

interface ClientModule {
    client: Client | undefined;
}

const clientModule: ClientModule = { client: undefined };

if(!process.env.API_KEY) {
    
    console.log('You must create a .env file with an API_KEY set.');
    
    process.exit();
}

create({
    useChrome: true,
    headless: false
}).then((client: Client) => {
    start(client);
    clientModule.client = client;
});

function start(client: Client) {
    listenToIncomingMessages(client);
    client.onAnyMessage(async (message: Message) => {
        await handleMessage(message);
    });
}

async function handleMessage(message: Message) {
    if(message.type !== MessageTypes.TEXT) return;
    let voteExecutor = new VoteExecutor();
    let factLawExecutor = new PassFactLawExecutor();
    let lawListExecutor = new LawListExecutor();
    let commands: CommandTree = new CommandTree({
        "register": new CommandTree({}, new RegisterExecutor().run),
        "laws": new CommandTree({}, lawListExecutor.run),
        "vote": new CommandTree({}, voteExecutor.run),
        "law": new CommandTree(
            {
                "fact":
                    new CommandTree({}, factLawExecutor.run)
            },
            (command: Command) => { })
    }, (command: Command) => { });

    if (message.content[0] == '#') {
        message.content = message.content.substring(1);
        let command: Command = parseCommand(message);
        console.log(command);
        commands.run(command);
    }

    if(message.content === "ping") {
        clientModule.client?.reply(message.chatId, 'Pong!', message.id);
    }

}

export default clientModule;