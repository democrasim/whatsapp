import { Command } from '@command/Command';
import clientModule from '@/index';
const config:Record<string,string> = require("../../config.json");

export default class CommandTree {
    private subCommands: Record<string, CommandTree>;
    private execute: (command: Command) => void;
    run = (command: Command) => {
        let current: CommandTree = this;
        for (let subcommand of command.type) {
            if (!(config[subcommand] in current.subCommands)) {
                clientModule.client?.sendText(command.group, subcommand + "is not a command");
                return;
            }
            current = current.subCommands[config[subcommand]];
        }
        try {
            current.execute(command);
        } catch(e) {
            clientModule.client?.sendText(command.group ,`⚠️ ${(e as Error)}`);
        }
    }

    constructor(subCommands: Record<string, CommandTree>, execute: (command: Command) => void) {
        this.subCommands = subCommands;
        this.execute = execute;
    }
}