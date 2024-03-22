import {Document} from 'mongoose'

export interface UserDoc extends Document{
    name:string
    phone:string | number
    email:string
    password:string
}


export interface UserRes{
    userData?:UserDoc
    token?:string
    status:true | false
    message:string
}

