import { model, Schema } from "mongoose";
import { IChatroom } from "../interfaces/chatroom.interface";

const ChatroomSchema: Schema = new Schema<IChatroom>({
    username: {type:String, required: true, default: 'Anonymous'},
    message: {type:String, required: true, default: '*Empty message'},
    admin: {type:Boolean, required: true, default: false}
},
{
    timestamps:true
})

export const Chatroom = model<IChatroom>('Chatroom', ChatroomSchema)