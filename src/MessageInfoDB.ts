import * as mongoose from "mongoose";

const uri: string = "mongodb://127.0.0.1:27017/test";

mongoose.connect(uri, (err: any) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log("Successfully Connected!");
    }
});

export interface ShortcutProps{
    law: string;
}

export interface IMessageInfo extends mongoose.Document {
    _id: string;
    props:ShortcutProps;
}

export const MessageInfoSchema = new mongoose.Schema({
    props: { type: Object, required: false },
    _id: { type: String, required: true }
});

const MessageInfo = mongoose.model<IMessageInfo>("messageInfo", MessageInfoSchema);
export default MessageInfo;
