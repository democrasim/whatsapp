import {Command} from './Command';

export default class CommandTree{
    private subCommands:Record<string,CommandTree>;
    private execute: (command:Command)=>void;
    run=(command:Command)=>{
        let current:CommandTree=this;
        for (let subcommand in command.type){
            if (!(subcommand in current.subCommands)){
                
            }
        }
    }
}