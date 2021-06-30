import clientModule from "@/index";
import { MessageId } from "@open-wa/wa-automate";

export async function writePayload(messageId: MessageId, payload: any) {

    const { client } = clientModule;
    if (!client) return;
    // @ts-ignore
    const page: Page = client._page;

    await page.evaluate((messageId: string, payload: any) => {
        // @ts-ignore
        window.Store.Msg.get(messageId).description = JSON.stringify(payload);
    }, messageId, payload);
}

export async function readPayload(messageId: MessageId) {
    const { client } = clientModule;
    if (!client) return;
    // @ts-ignore
    const page: Page = client._page;

    const payload = await page.evaluate((messageId: string) => {

        // @ts-ignore
        console.log(window.Store.Msg.get(messageId).description);
        // @ts-ignore
        return window.Store.Msg.get(messageId).description;
    }, messageId)

    return payload;
}