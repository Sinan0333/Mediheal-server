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
    is_blocked:{
        type:Boolean,
        default:false
    }
})

export default  model<UserDoc>('User',UserSchema)

