import { Types } from "mongoose"

export interface MessageDoc {
    sender:Types.ObjectId
    receiver:Types.ObjectId
    text:string
}