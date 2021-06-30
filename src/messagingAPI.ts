import { Client, ChatId } from '@open-wa/wa-automate';
import express from 'express';

let PORT = process.env.PORT || 8081;


export default async function listenToIncomingMessages(client: Client) {
    const app = express();
    app.use(express.json());


    app.post('/new_law', async (req, res) => {

    })

    app.post('/send_message', async (req, res) => {
        let { chatId, message } = req.body;

        console.log(`Requesting ${chatId} with content: ${message}`);


        let sent = await client.sendText(chatId as ChatId, message);
        if (sent) {
            res.sendStatus(200);
        } else {
            res.sendStatus(503);
        }

    });


    app.listen(PORT, () => {
        console.log("(!) Now listening on port " + PORT)
    });
}