import { create, Client, Message } from '@open-wa/wa-automate';
import PassFactLawExecutor from './PassLawExecutor';
import { Command } from './Command';
import listenToIncomingMessages from './messagingAPI';
import CommandExecutor from './CommandExecutor';
import { parseCommand } from './CommandParser';
import CommandTree from './CommandsTree';
import VoteExecutor from './VoteExecutor';
import * as dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/.env' });

interface ClientModule {
    client: Client | undefined;
}

const clientModule: ClientModule = { client: undefined };


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
        if (message.fromMe) {
            await handleMessage(message);
        }
    });
}

async function handleMessage(message: Message) {
    let voteExecutor: CommandExecutor = new VoteExecutor();
    let factLawExecutor: CommandExecutor = new PassFactLawExecutor();
    let commands: CommandTree = new CommandTree({
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

}

export default clientModule;