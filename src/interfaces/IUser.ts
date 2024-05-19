import {Document} from 'mongoose'

export interface UserDoc extends Document{
    name:string
    phone:string
    email:string
    password:string
    verified:boolean
    image:string
    wallet:number
    history:History[]
    is_blocked:boolean
    role:string
}


export interface UserRes{
    userData?:UserDoc | null
    token?:string
    refreshToken?:string
    otp_id?:string
    status:true | false
    message:string
}

export interface History {
    amount:number
    description:string
    cancelReason?:string
    date:Date
}

export interface DecodedJWT {
    sub?: string;
    name?: string;
    iat?: number;
    exp?: number;
    role?: string;
    email?: string;
  }