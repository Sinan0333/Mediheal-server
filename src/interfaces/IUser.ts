import {Document} from 'mongoose'

export interface UserDoc extends Document{
    name:string
    phone:string
    email:string
    password:string
    verified:boolean
    image:string
    is_blocked:boolean
}


export interface UserRes{
    userData?:UserDoc | null
    token?:string
    otp_id?:string
    status:true | false
    message:string
}

