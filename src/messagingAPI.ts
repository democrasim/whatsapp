import {Client, ChatId} from '@open-wa/wa-automate';
import express from 'express';


export default async function listenToIncoimgMessages(client:Client){
    const app = express();
    app.use(express.json());
    app.post('/send_message', (req,res)=>{
        let { phone, message } = req.body;
        client.sendText((`${phone}@c.us`) as ChatId, message);
    })
    app.listen(8081);
}