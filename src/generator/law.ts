import { Content, ContentType, Law } from "@/types";
import dayjs from "dayjs";
import calendar from 'dayjs/plugin/calendar';

dayjs.extend(calendar);

export function lawToTextSimple(law: Law) {
    return `Law #${law.number}
${law.contentString}`;
}

export function lawToTextAnnouncement(law: Law) {
    return `Law *#${law.number}*

Legislator: *${law.legislator.name}*

${law.content}`
}

export function contentsToString(contents: Content[]) {
    let output = '';

    contents.forEach((content, i) => output += contentToString(content, i + 1) + '\n');
}

export function contentToString(content: Content, index: number) {
    const typeNames: Record<ContentType, string> = {
        'ADD_MEMBER': 'הוספת חבר',
        'BAN': 'איסור',
        'CHANGE_PRESIDENT': 'שינוי נשיא',
        'EVENT': 'אירוע',
        'FACT': 'עובדה',
        'REQUIREMENT': 'חובה'
    }

    let output = `§${index} ${typeNames[content.type]}
`;
    if (content.type === 'ADD_MEMBER') {
        const { member, reason } = content;
        output += `לצרף את ${member!.name}, עם מספר הטלפון ${member!.phone}
סיבה להצטרפות: ${reason}
`
    }

    if (content.type === 'CHANGE_PRESIDENT') {
        const { newPresident } = content;
        output += `נשיא חדש: ${newPresident!.name}`
    }

    if (content.type === 'EVENT') {
        const { location, date } = content;
        const { x, y } = location!;

        const dateText = dayjs(date!).calendar(undefined, {
            sameElse: 'lll'
        });

        output += `תאריך: ${dateText}
מיקום: ${x} ${y}
`
    }

    if (['BAN', 'FACT', 'REQUIREMENT', 'EVENT'].includes(content.type)) {
        const { description } = content;
        output += description + '\n';
    }


    return output;
}