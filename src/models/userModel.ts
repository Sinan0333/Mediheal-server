import {Schema,model} from 'mongoose'
import { UserDoc } from '../interfaces/IUser'

const UserSchema = new Schema <UserDoc>({
    name:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    verified:{
        type:Boolean,
        default:false
    },
    image:{
        type:String,
        default:""
    },
    wallet:{
        type:Number,
        default:0
    },
    history:[
        {
            amount:{
                type:Number,
                required:true
            },
            date:{
                type:Date,
                required:true
            },
            description:{
                type:String,
                required:true
            },
            cancelReason:{
                type:String
            }
        }
    ],
    is_blocked:{
        type:Boolean,
        default:false
    },
    role:{
        type:String,
        default:"user"
    }
})

export default  model<UserDoc>('User',UserSchema)

