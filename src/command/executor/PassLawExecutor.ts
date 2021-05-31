import { Command } from "@command/Command";
import CommandExecutor from "@command/CommandExecutor";
import clientModule from '@/index';
const config:Record<string,string> = require("../../../config.json");

export default class PassFactLawExecutor extends CommandExecutor {
    
    execute(command: Command): void {
        let s:string = "law content: "+command.content;
        if (command.flags.includes("anonymous")){
            s+="\nanonymous law";
        }
        if (command.props["fakeName"]!=""){
            s+="\nfake name: "+command.props["fakeName"];
        }
        clientModule.client?.sendText(command.group, s);
    }
    constructor() {
        super([], {"fakeName":""}, ["anonymous"]);
    }
}