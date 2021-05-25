import { Command } from "./Command";
import CommandExecutor from "./CommandExecutor";
import clientModule from './index';

export default class VoteExecutor extends CommandExecutor {
    execute(command: Command): void {
        clientModule.client?.sendText(command.group, "voted on law " + command.props["law"] + " with " + command.props["vote"]);
    }
    constructor() {
        super(["law", "vote"], {}, []);
    }
}