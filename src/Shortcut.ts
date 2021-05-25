interface PropExpr{
    type:PropType ;
    propName?:string;
    value?:string;
}

type PropType="static"|"prop"|"repliedProp"|"alias";
let a:PropExpr={
    type:"static"
}
interface Shortcut{
    
}