interface CommandArgs{
    commandName:string,
    content:string
}

export function splitToArgs(command: string) : CommandArgs {

    let headerArgs: string[] = command.split(/(\s)+/g);
    let commandName: string = headerArgs[0];
    let content: string;
    if (headerArgs.length < 3) {
        content = ""
    }
    else {
        let index: number = command.indexOf(headerArgs[2]);
        content = command.substr(index);
    }
    return {
        commandName,
        content
    };
}