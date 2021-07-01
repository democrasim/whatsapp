import { vote } from "@/service/lawService";
import { register } from "@/service/userService";
import { VoteType } from "@/types";
import { Flow, registerFlow } from "..";
import { readPayload } from "../payload";
import { askBoolean } from "../util";

const flow: Flow = async (error, send, ask, data, args) => {
    const voteText = data.content.split(' ')[0];


    const voteToType: Record<string, VoteType> = {
        'בעד': 'FOR',
        'נמנע': 'ABSTAIN',
        'נגד': 'AGAINST'
    };

    const voteType = voteToType[voteText];


    if (!data.quoted) {
        error('עליך להגיב על משהו בשביל להצביע');
        return;
    }

    const { lawId } = await readPayload(data.quoted?.id) as { lawId: string };


    const reason = args.join(' ');


    const result = await vote(data.member!.id, lawId, voteType, reason);

    if (result) {
        send('הצבעתך על חוק ' + result?.number + 'נקלטה בהצלחה', true);
    }
}

registerFlow({
    memberOnly: true,
    privateOnly: false,
    aliases: ['בעד', 'נגד', 'נמנע'],
    identifier: 'הצבעה',
    description: 'פקודה בשביל להצביע',
    usage: '$בעד/נגד/נמנע',
    name: 'הרשמה',
}, flow)
