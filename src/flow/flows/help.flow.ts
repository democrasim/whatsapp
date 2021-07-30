import { Flow, FlowOptions, getFlows, registerFlow } from "..";
import { readPayload } from "../payload";
import { askBoolean } from "../util";

const flow: Flow = async (error, send, ask, data, args) => {
    const [arg] = args


    const minified = arg && (arg === 'מצומצם')

    const flows = getFlows();


    const privateEmote = '🔐';
    const memberEmote = '🎫';

    let output = `*עזרה כללית*
${privateEmote} - בפרטי בלבד
${memberEmote} - משתמשים רשומים בלבד
`;


    const title = (options: FlowOptions) => `*${options.name}* ${(options.memberOnly ? memberEmote : '')} ${(options.privateOnly ? privateEmote : '')}`;

    flows.forEach(flow => {
        const { options } = flow;

        if (!minified && arg && !(options.aliases?.includes(arg) || options.name?.includes(arg))) return;

        output += `${title(options)}`

        if (minified) {
            output += `: $${options.identifier}
`
        } else {
            output += `
  ${options.description ?? 'אין תיאור'}
  שימוש: ${options.usage ?? `$${options.identifier}`}
`;
        }

    })

    send(output);
}

registerFlow({
    memberOnly: false,
    privateOnly: true,
    identifier: 'עזרה',
    aliases: ['?', 'פקודות'],
    description: 'מציג את כל העזרה',
    name: 'פקודת עזרה',
    usage: '$עזרה [מצומצם?/ביטוי חיפוש]'
}, flow)
