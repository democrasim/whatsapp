import { Flow, registerFlow } from "..";
import { askBoolean } from "../util";

const flow: Flow = async (error, send, ask, data) => {
    const { choice } = await askBoolean(ask, 'בטוח שתרצה לבדוק?');

    if (choice) {
        const { text } = await ask('מה שמך ידידי הטוב?');

        await send(`${text} נשמע כמו שם של חנונים`);
    } else {
        await send('אשפוז');
    }
}

registerFlow({
    memberOnly: false,
    privateOnly: false,
    identifier: 'פינג',
    description: 'פקודת בדיקה',
    name: 'בדיקה',
}, flow)
