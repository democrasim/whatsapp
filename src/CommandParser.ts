import { Command } from './Command';
import { Message, Client } from '@open-wa/wa-automate';
const config = require("../config.json");

export function parseCommand(message: Message): Command {
    let rows: string[] = message.content.split('\n');
    let type: string[] = rows.shift().split(/\s+/);
    let props: Record<string, string> = {};
    let flags: string[] = [];
    let content: string = "";
    let sender: string = message.author;
    let group: string = message.chatId;
    let replied:string=message.quotedMsg.content;
    if (message.quotedMsg.fromMe){

    }
    for (let row in rows) {
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
        ignoreAdditionalOptions:true
    };
}