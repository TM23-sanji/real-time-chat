import mongoose, {Model,Types, Document, Schema} from "mongoose";

export interface IChat extends Document {
    projectName:string;
    sender:string;
    text:string;
}

const chatSchema:Schema = new Schema({
    projectName:{type:String, required:[true, 'Project Name is required']},
    sender:{type:String, required:[true, 'Sender is required']},
    text:{type:String, required:[true, 'Text is required']}
})

const Chat = mongoose.model<IChat>('chat',chatSchema);
export default Chat;