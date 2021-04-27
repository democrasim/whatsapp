import { splitToArgs } from './lexer';
import {Command} from './Command';
import {FlagsCommand} from './FlagsCommand';

let client : Client = null;

import { create, Client } from '@open-wa/wa-automate';

create().then(client => start(client));

function start(c) {
    client = c;
    let command:Command=new FlagsCommand(["a","b"],{"c":"c", "d":"d"},["e","f"] )
  client.onAnyMessage(async message => {
      console.log("f");
    if (message.fromMe) {
        command.run(message, client);
        console.log("fdghfdgh");
      await client.sendText(message.from, '👋 Hello!');
    }
  });
}


console.log(splitToArgs("aaa         dsg     f"));


export default client;