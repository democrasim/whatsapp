import { Command } from './Command';
import { splitToArgs, CommandArgs } from './lexer';
abstract class SubCommand implements Command {
    private subCommands: Record<string, Command>;
    run = (command: string) => {
        let args: CommandArgs = splitToArgs(command);
        let subCommand: Command = this.subCommands[args.commandName];
        subCommand.run(args.content);
    }
    constructor(subCommands: Record<string, Command>) {
        this.subCommands = subCommands;
    }
}