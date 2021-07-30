import { Flow, registerFlow } from "..";
import { readPayload } from "../payload";
import { askBoolean } from "../util";

const flow: Flow = async (error, send, ask, data) => {
    if (data.quoted) {
        console.log(data.quoted.id);
        await send(JSON.stringify(await readPayload(data.quoted.id)));
    }
}

registerFlow({
    memberOnly: false,
    privateOnly: false,
    identifier: 'מידע',
    description: 'פקודת בדיקה להחזיר מידע נסתר',
    name: 'מידע נסתר',
}, flow)
