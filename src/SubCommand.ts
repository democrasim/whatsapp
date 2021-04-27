import { Command } from './Command';
import { splitToArgs, CommandArgs } from './lexer';
import { Message,Client } from '@open-wa/wa-automate';

abstract class SubCommand implements Command {
    private subCommands: Record<string, Command>;
    run = (command: Message, client:Client) => {
        let args: CommandArgs = splitToArgs(command.content);
        let subCommand: Command = this.subCommands[args.commandName];
        command.content=args.content;
        subCommand.run(command,client);
    }
    constructor(subCommands: Record<string, Command>) {
        this.subCommands = subCommands;
    }
}