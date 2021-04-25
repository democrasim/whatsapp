import {Command} from './Command';
export class FlagsCommand implements Command {
    private requiredFlags:string[];
    private optionalFlags:Record<string, string>;
    private booleanFlagsLstring[];
    constructor(requiredFlags:string[],
        private optionalFlags:Record<string, string>,
        private booleanFlagsLstring[]) {
        this.booleanFlagsLstring=booleanFlagsLstring;
        this.optionalFlags=optionalFlags;
        this.requiredFlags=requiredFlags;
    }
    run=(command:string)=>{
        let rows:string[]=command.split("\n");
        let content:string=rows.shift();
        array.forEach(element => {
            
        });
    }

}