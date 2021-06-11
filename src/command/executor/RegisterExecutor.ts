import { Command } from "@command/Command";
import CommandExecutor from "@command/CommandExecutor";
import clientModule from '@/index';
const config:Record<string,string> = require("../../../config.json");
import { register } from "@service/userService"

interface Props {
    reason: string;
}

export default class RegisterExecutor extends CommandExecutor {
    
    async execute(command: Command) {
        

        console.log("Registering user")

        const { reason } = command.props as unknown as Props;
        const { content } = command;

        console.table({ reason, content });

        const result = await register(content, command.sender.split('@')[0], reason);

        clientModule.client?.sendText(command.group, `A law for your registration as been successfuly sent with id ${result.id}`);
    }
    constructor() {
        super([], {"reason":"no reason"}, []);
    }
}