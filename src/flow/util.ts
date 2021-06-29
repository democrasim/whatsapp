import { MessageId } from "@open-wa/wa-automate";
import { AskCall, Response } from ".";

export async function askOptional(ask: AskCall, content: string): Promise<Partial<Response>> {
    const response = await ask(`${content}. הגב עם ${"```,```"} בשביל לדלג`);
    const { text } = response;

    if (text === ',') return {
        ...response,
        text: undefined
    };

    return {
        ...response,
        text
    };
}

export async function askBoolean(ask: AskCall, content: string): Promise<Response & { choice: boolean }> {

    const truthyStrings = ['כן', 'בהחלט', 'ברור', 'לגמרי', 'יאללה', 'כ', 'true', 'כןכן'];

    const falsyStrings = ['לא', 'לא בתחום', 'לא קול', 'בכלל לא', 'האם שרבי רזה', 'ל', '!', 'כלל לא', 'בזוי', 'אל', 'תתאבד'];

    const response = await ask(`${content} הגב עם כן/לא`, (message) => truthyStrings.includes(message.content) || falsyStrings.includes(message.content), 'לא הבנתי אם זה כן או לא, נסה שוב');

    if (truthyStrings.includes(response.text)) return {
        ...response,
        choice: true
    }
    if (falsyStrings.includes(response.text)) return {
        ...response,
        choice: false
    }
    throw new Error("check did not go well.");
}

