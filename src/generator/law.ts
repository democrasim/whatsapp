import { allMembers } from "@/service/userService";
import { Content, ContentType, Law, Status, Vote, VoteType } from "@/types";
import { PRIORITY_HIGHEST } from "constants";
import dayjs from "dayjs";
import calendar from 'dayjs/plugin/calendar';
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { allowedNodeEnvironmentFlags } from "process";
import { isNull } from "util";
import { createBrotliCompress } from "zlib";

dayjs.extend(calendar);
dayjs.extend(localizedFormat);

export function lawToTextSimple(law: Law) {
    return `חוק #${law.number}
${law.title}
${law.contentString}`;
}

export function lawToTextAnnouncement(law: Law) {
    return `הצעת חוק *#${law.number}*
הוגה: *${law.legislator.name}*

${law.title}
${contentsToString(law.content)}`
}


export function lawDoneAnnouncement(law: Law) {
    return `חוק *#${law.number}*
הוגה: *${law.legislator.name}*

${law.title}
${contentsToString(law.content)}
תוצאה: ${resultString(law.status)}
הצבעות:
${voteString(law.votes)}`
}

export function lawDisplay(law: Law) {
    const output = `חוק *#${law.number}*
הוגה: *${law.legislator.name}*

${law.title}
${contentsToString(law.content)}
מצב: ${resultString(law.status)}
הוצע: ${dayjs(law.timestamp).format('lll')}
${law.status === 'UNDER_VOTE' ? 'יקבל' : 'קיבל'} תוצאה ב: ${dayjs(law.resolveTime).format('lll')}

הצבעות:
${voteString(law.votes)}`

    return output;
}

export function voteString(votes: Vote[]) {
    let output = '';

    const voteStrings: Record<VoteType, string> = {
        'ABSTAIN': '🤙🏻',
        'AGAINST': '👎🏻',
        'FOR': '👍🏻'
    }

    votes.forEach(vote => {
        output += `  ${voteStrings[vote.vote]} ${vote.voter.name}
`;

    });


    if (votes.length === 0) return 'אין הצבעות';
    return output;
}

export function resultString(status: Status) {
    const statusStrings: Record<Status, string> = {
        'CANCELED': '🚫 בוטל',
        'FAILED': 'נכשל ☠️',
        'PASSED': '✅ עבר',
        'UNDER_VOTE': 'תחת הצבעה ⏳',
        'VETOED': '⚠️ בוטל על ידי הנשיא',
    };

    return statusStrings[status];
}

export function contentsToString(contents: Content[]) {
    let output = '';

    contents.forEach((content, i) => output += contentToString(content, i + 1) + '\n');

    return output;
}

export function contentToString(content: Content, index: number) {
    const typeNames: Record<ContentType, string> = {
        'ADD_MEMBER': 'הוספת חבר',
        'BAN': 'איסור',
        'CHANGE_PRESIDENT': 'שינוי נשיא',
        'EVENT': 'אירוע',
        'FACT': 'עובדה',
        'REQUIREMENT': 'חובה',
        'REMOVE_MEMBER':'גירוש'
    }

    let output = `§${index} ${typeNames[content.type]}
`;

    if (content.type === 'ADD_MEMBER') {
        const { member, reason } = content;
        output += `לצרף את ${member!.name}, עם מספר הטלפון ${member!.phone}
סיבה להצטרפות: ${reason}
`;
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
`;
    }

    if (['BAN', 'FACT', 'REQUIREMENT', 'EVENT'].includes(content.type)) {
        const { description } = content;
        output += description + '\n';
    }

    output = output.split('\n').map(str => '  ' + str).join('\n');

    return output;
}