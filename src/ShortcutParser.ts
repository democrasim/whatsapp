import { Command } from './Command';
import { Message, Client } from '@open-wa/wa-automate';
const shortcuts: any[] = require("../shortcuts.json");
import MessageInfo, { IMessageInfo } from './MessageInfoDB';

export async function parseShortcut(message: Message): Promise<Command | null> {

    let rows: string[] = message.content.split('\n');
    let type: string[] = rows[0].split(/\s+/);
    let props: Record<string, string> = {};
    let flags: string[] = [];
    let content: string = "";
    let sender: string = message.author;
    let group: string = message.chatId;

    if (!(message.quotedMsg) || !message.quotedMsg.fromMe) {
        return null;
    }
    let messageInfo: IMessageInfo;
    let result = await MessageInfo.findById(message.quotedMsg.id);
    if (result == null) {
        return null;
    }
    let alias: string = rows[0].split(/\s+/)[0];
    if (rows[0].split(/\s+/).length >= 2) {
        content = rows[0].substring(rows[0].indexOf(rows[0].split(/\s+/)[1]));
    }
    rows.shift();
    let shortcut=findShortcut(alias);
    return null;
}

// (err: any, result: any) => {
//     messageInfo = result;
//     Object.keys(result).forEach(e => {
//         props[e] = result[e];
//     })
//     if (result != null) {
        
        
//     }
// }

function findShortcut(word: string) {
    for (let i = 0; i < shortcuts.length; i++) {
        for (let j = 0; j < shortcuts[i].aliases.length; j++) {
            if (word == shortcuts[i].aliases[j]) {
                return shortcuts[i];
            }
        }
    }
}