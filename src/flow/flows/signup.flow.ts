import { register } from "@/service/userService";
import { Flow, registerFlow } from "..";
import { askBoolean } from "../util";

const flow: Flow = async (error, send, ask, data, args) => {
    
    let name = '';

    if (data.member) {
        error('אתה כבר משתמש רשום');

        return;
    }

    if (args.length === 0) {
        name = (await ask('מהו שמך?')).text;
    } else {
        name = args.join(' ');
    }

    const { text: reason } = await ask('למה אתה מעוניין להצטרף?')

    const result = await register(
        name,
        data.contact.id.split("@")[0],
        reason
    );

    if (result) send(`חוק לצירופך הוצע בהצלחה עם המספר #${result.number}`);

}

registerFlow({
    memberOnly: false,
    privateOnly: true,
    identifier: 'הרשמה',
    description: 'פקודה בשביל להירשם',
    usage: '$הרשמה [שם?]',
    name: 'הרשמה',
}, flow)
