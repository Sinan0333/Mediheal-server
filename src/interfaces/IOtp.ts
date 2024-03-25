import {Document} from 'mongoose'

export interface OtpDoc extends Document{
    email:string
    otp:string
}