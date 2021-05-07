import {Client, ChatId} from '@open-wa/wa-automate';
import express from 'express';


export default async function listenToIncomingMessages(client:Client){
    const app = express();
    app.use(express.json());
    app.post('/send_message', async (req,res)=>{
        let { chatId, message } = req.body;
        client.sendText(chatId as ChatId, message);
    });


    app.listen(8081);
}