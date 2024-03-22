import {Schema,model} from 'mongoose'
import { UserDoc } from '../interfaces/IUser'

const AdminSchema = new Schema <UserDoc>({
    name:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
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
})

export default  model<UserDoc>('Admin',AdminSchema)

