import { Law } from "@/types";

export function lawToTextSimple(law: Law) {
    return `Law #${law.number}
${law.contentString}`;
}

export function lawToTextAnnouncement(law: Law) {
    return `Law *#${law.number}*

Legislator: *${law.legislator.name}*

${law.content}`
}