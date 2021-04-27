import {Command} from './Command';
import { Message,Client } from '@open-wa/wa-automate';

import { splitToArgs, CommandArgs } from './lexer';
export class FlagsCommand implements Command {
    private requiredFlags:string[];
    private optionalFlags:Record<string, string>;
    private booleanFlagsString:string[];
    constructor(requiredFlags:string[],
         optionalFlags:Record<string, string>,
         booleanFlagsString:string[]) {
        this.booleanFlagsString=booleanFlagsString;
        this.optionalFlags=optionalFlags;
        this.requiredFlags=requiredFlags;
    }
    run=(command:Message,client:Client)=>{
        let rows:string[]=command.content.split("\n");
        let content:string=rows.shift();
        let valueFlags:Record<string,string> = {};
        let booleans:Record<string, boolean> = {};
        for (let key in this.optionalFlags){
            valueFlags[key]=this.optionalFlags[key];
        }
        for (let key in this.booleanFlagsString){
            booleans[key]=false;
        }
        rows.forEach(element => {
            let flagArgs:CommandArgs=splitToArgs(element);
            if (flagArgs.commandName in this.booleanFlagsString){
                booleans[flagArgs.commandName]=true;
            }
            if (!(flagArgs.commandName in this.optionalFlags) && !(flagArgs.commandName in this.requiredFlags)){
                client.sendText(command.from,"flag not found- "+flagArgs.commandName);
            }
            valueFlags[flagArgs.commandName]=flagArgs.content;
        });
        for (let key in this.requiredFlags){
            if (!(key in valueFlags)){
                client.sendText(command.from, "missing requied flag- "+this.requiredFlags[key])
            }
        }
    }

}