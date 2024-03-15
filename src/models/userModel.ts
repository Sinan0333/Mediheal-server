import {Schema,model} from 'mongoose'
import { UserData } from '../interfaces/IUser'

const UserSchema = new Schema <UserData>({
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
})

export default  model<UserData>('User',UserSchema)

