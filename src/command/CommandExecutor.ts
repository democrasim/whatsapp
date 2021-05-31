import { Command } from "@command/Command";
import clientModule from "@/index";
const config:Record<string,string> = require("@/../config.json");


export default abstract class CommandExecutor {
    private requiredOptions: string[];
    private optionalOptions: Record<string, string>;
    private flags: string[];
    abstract execute(command: Command) : void;

    constructor(requiredFlags: string[],
        optionalFlags: Record<string, string>,
        flags: string[]) {
        this.flags = flags;
        this.optionalOptions = optionalFlags;
        this.requiredOptions = requiredFlags;
    }
    private validate = (command: Command): boolean => {
        let translatedFlags: string[] = [];
        for (let flag of command.flags) {
            if (flag in config) {
                translatedFlags.push(config[flag]);
            }
            else {
                clientModule.client?.sendText(command.group, "bad flag - " + flag);
                return false;
            }
        }
        command.flags = translatedFlags;
        let translatedOptions: Record<string, string> = {};
        for (let option in command.props) {
            if (option in config) {
                translatedOptions[config[option]] = command.props[option];
            }
            else {
                clientModule.client?.sendText(command.group, "bad flag - " + option);
                return false;
            }
        }
        command.props = translatedOptions;
        for (let option in command.props) {
            if (!(option in this.optionalOptions) && !(option in this.requiredOptions)) {
                clientModule.client?.sendText(command.group, "bad option - " + option);
                return false;
            }
        }
        for (let flag of command.flags) {
            console.log(flag);
            console.log(this.flags);
            if (this.flags.indexOf(flag)==-1) {
                clientModule.client?.sendText(command.group, "bad flag - " + flag);
                return false;
            }
        }
        for (let required of this.requiredOptions) {
            if (!(required in command.props)) {
                clientModule.client?.sendText(command.group, "missing option - " + required);
                return false;
            }
        }
        for (let optional in this.optionalOptions){
            if (!(optional in command.props)){
                command.props[optional]=this.optionalOptions[optional];
            }
        }
        return true;
    }
    run = (command: Command) => {
        if (this.validate(command)) {
            this.execute(command);
        }
    }
}