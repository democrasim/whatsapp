import { Command } from '@command/Command';
import { Message, Client, ChatId } from '@open-wa/wa-automate';
const shortcuts = require("@/../shortcuts.json");
import MessageInfo, { IMessageInfo } from '@/MessageInfoDB';

export function parseCommand(message: Message): Command {
    let rows: string[] = message.content.split('\n');
    let type: string[] = rows[0].split(/\s+/);
    let props: Record<string, string> = {};
    let flags: string[] = [];
    let content: string = "";
    let sender: string = message.author;
    let group: ChatId = message.chatId;
    rows.shift();
    
    for (let row of rows) {
        if (row != "" && row[0] == '#') {
            let rowContent: string = row.substring(1);
            let words: string[] = rowContent.split(/\s+/);
            if (words.length == 0) {
                content += "#";
            }
            else if (words.length == 1) {
                flags.push(words[0]);
            }
            else {
                let optionValue: string = rowContent.substring(rowContent.indexOf(words[1]));
                props[words[0]] = optionValue;
            }
        }
        else {
            content += row;
        }
    }
    return {
        type,
        props,
        flags,
        content,
        sender,
        group,
    };
}
