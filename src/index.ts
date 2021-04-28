import { splitToArgs } from './lexer';
import { Command } from './Command';
import { FlagsCommand } from './FlagsCommand';
import { CommandRunner } from './CommandRunner';
import listenToIncoimgMessages from './messagingAPI';

let client: Client = null;

import { create, Client } from '@open-wa/wa-automate';

let command: Command = new FlagsCommand(["a", "b"], { "c": "c", "d": "d" }, ["e", "f"]);


create().then(client => start(client));

function start(client) {
  client.onAnyMessage(async message => {
    const runner: CommandRunner = new CommandRunner({ "walak": command }, client)

    console.log("f");
    if (message.fromMe) {
      runner.run(message);
      //command.run(message, client);
      console.log("fdghfdgh");
      //await client.sendText(message.from, '👋 Hello!');
    }
  });
  listenToIncoimgMessages(client);
}


console.log(splitToArgs("aaa         dsg     f"));



// let command:Command=new FlagsCommand(["a","b"],{"c":"c", "d":"d"},["e","f"] )
// command.run({content:"a b\nc d"}, null);