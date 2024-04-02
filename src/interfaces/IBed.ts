import { ObjectId } from "mongoose"

export interface BedDoc {
    _id?:string
    type:string
    charge:number
    assignDate?:Date
    dischargeDate?:Date
    assignBy?:string
    patient?:ObjectId
    description?:string
    available:boolean
    total?:number
}