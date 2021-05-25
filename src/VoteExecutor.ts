import { Command } from "./Command";
import CommandExecutor from "./CommandExecutor";
import clientModule from './index';
const config:Record<string,string> = require("../config.json");

export default class VoteExecutor extends CommandExecutor {
    execute(command: Command): void {
        let vote:string=config[command.props["law"]];
        if (!(vote in ["for", "against", "neutral"])){
            clientModule.client?.sendText(command.group, command.props["vote"]+" is not a valid vote");
        }
        clientModule.client?.sendText(command.group, "voted on law " + command.props["law"] + " with " + command.props["vote"]);
    }
    constructor() {
        super(["law", "vote"], {}, []);
    }
}