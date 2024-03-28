import {Schema,model} from 'mongoose'
import { UserDoc } from '../interfaces/IUser'

const AdminSchema = new Schema <UserDoc>({
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
    }
})

export default  model<UserDoc>('Admin',AdminSchema)

