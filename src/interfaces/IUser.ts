import {Document} from 'mongoose'

export interface UserDoc extends Document{
    name:string
    phone:string | number
    email:string
    password:string
    verified:boolean
}


export interface UserRes{
    userData?:UserDoc | null
    token?:string
    otp_id?:string
    status:true | false
    message:string
}

