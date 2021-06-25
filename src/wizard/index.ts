import { Member } from "@/types";
import { Message } from "@open-wa/wa-automate";
import { isEmpty } from "lodash";
import { fetchMemberById, fetchMemberByPhone } from "@service/userService";
import clientModule from "..";
import { notRegisteredError } from "@/generator/command";

enum WizardTypes {
    Text,
    Number,
}

interface WizardProperty<T extends WizardTypes = WizardTypes.Text, K = T> {
    messageType: T;
    prompt: string;
    options?: string[];
    check?(m: Message): boolean;
    regex?: RegExp;
    error?: string;
    onDone?(current: string, props: FinishedProperties): void;
    optional?: boolean;
    default: T;
    process?(current: UnprocessedProperty<T>): K;
}

type NamedProperty<T extends WizardTypes = WizardTypes.Text, K = T> =
    WizardProperty<T, K> & { name: string };

type UnprocessedProperty<T> = {
    type: T;
    value: any;
} & FinishedPropertyMap;

type FinishedPropertyMap =
    | {
          type: WizardTypes.Text;
          value: string;
      }
    | {
          type: WizardTypes.Number;
          value: number;
      };

type FinishedProperties = {
    [P in string]: any;
};

type WizardProperties = {
    [P in string]: WizardProperty<any, any>;
};

interface WizardCommand {
    identifier: string;
    privateOnly: boolean;
    memberOnly: boolean;
    finishedResponse?: string;
    properties: WizardProperties;
    name: string;
    helpMessage?: string;
    onDone?(data: OngoingCommand): Promise<void> | void;
}

interface OngoingCommand {
    command: WizardCommand;
    member?: Member;
    currentProp?: WizardProperties;
    props: FinishedProperties;
    finished?: boolean;
    currentMessage: Message;
}

function propList(props: WizardProperties): NamedProperty[] {
    const result = Object.entries(props).map(([name, propData]) => {
        return { name: name, ...propData };
    });

    return result;
}

class Wizard {
    private registeredCommands: WizardCommand[] = [];

    private ongoingCommands: OngoingCommand[] = [];

    public registerCommand(command: WizardCommand) {
        this.registeredCommands.push(command);
    }

    async processCommand(message: Message) {
        const { content, isGroupMsg, chatId, id } = message;
        if (!content.startsWith("$")) return;

        const identifier = content.substring(1);

        const command = this.findCommand(identifier);

        if (!command) return;

        const { properties, privateOnly, memberOnly } = command;

        if (isEmpty(properties)) return;
        if (isGroupMsg && privateOnly) return;

        const member = await fetchMemberByPhone(
            message.sender.id.replace("@c.us", "")
        );
        if ((!member || !member.registered) && memberOnly) {
            clientModule.client!.reply(chatId, notRegisteredError(), id);

            return;
        }

        this.startCommand(command, message);
    }

    handleEmptyCommand(command: WizardCommand) {
        // TODO: finish this
    }

    async finishCommand(command: OngoingCommand) {
        const {
            currentMessage: { chatId, id },
            props,
            command: { finishedResponse, onDone },
        } = command;

        if (onDone) {
            await onDone(command);
        }

        if (finishedResponse) {
            clientModule.client!.reply(chatId, finishedResponse, id);
        }

        command.finished = true;
    }

    startCommand(command: WizardCommand, message: Message) {
        const { properties } = command;
        const {} = message;

        const props = propList(properties);
    }

    promptCommand(command: OngoingCommand) {
        // TODO: finish this
        const messageCollector = clientModule.client!.createMessageCollector(
            command.currentMessage,
            (m: Message) => m.quotedMsg?.id === command.currentMessage.id,
            {}
        );
    }

    findCommand(identifier: string): WizardCommand | undefined {
        return this.registeredCommands.find(
            (value) => value.identifier === identifier
        );
    }
}

export default new Wizard();
