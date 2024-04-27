import {Schema,model} from 'mongoose'
import { MessageDoc } from '../interfaces/Imessage'


const MessageSchema = new Schema <MessageDoc>({
    sender:{
        type:Schema.Types.ObjectId,
        required:true
    },
    receiver:{
        type:Schema.Types.ObjectId,
        required:true
    },
    text:{
        type:String,
        required:true
    }
},{
    timestamps:true
})

export default  model<MessageDoc>('message',MessageSchema)

