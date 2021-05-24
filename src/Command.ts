export interface Command{
    type:string[],
    props:Record<string,string>,
    flags:string[],
    content:string,
    sender:string,
    group:string,
    ignoreAdditionalOptions:boolean
}