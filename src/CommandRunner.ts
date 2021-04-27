import {splitToArgs , CommandArgs} from './lexer';
import {Command} from './Command';
import { Message, Client } from '@open-wa/wa-automate';

export class CommandRunner{
    private commands : Record<string, Command>;
    private client:Client;
    constructor(commands:Record<string,Command>, client:Client){
        this.commands=commands;
        this.client=client;
    }
    run=(message:Message)=>{
        let args:CommandArgs=splitToArgs(message.content);
        message.content=args.content;
        this.commands[args.commandName]?.run(message, this.client);
    }
}