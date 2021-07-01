import clientModule from "@/index";
import { ChatId, MessageId } from "@open-wa/wa-automate";

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

export async function sendPayloaded(content: string, payload: any, chatId: ChatId) {

    const { client } = clientModule;
    if (!client) return;
    // @ts-ignore
    const page: Page = client._page;

    // @ts-ignore
    client.pup(
        ({ payload, chatId, content }: { payload: any, chatId: ChatId, content: string }) => {
            // @ts-ignore
            const chatSend = WAPI.getChat(chatId);
            // @ts-ignore
            chatSend.sendMessage(content, { linkPreview: { description: JSON.stringify(payload) } })
        }, {
        payload,
        chatId,
        content
    }
    );
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

    return JSON.parse(payload);
}