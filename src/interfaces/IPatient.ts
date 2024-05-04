import { Types,ObjectId } from "mongoose"
import {UserDoc} from './IUser'

export interface PatientDoc extends Document{
    _id?:string
    id?:string
    userId:Types.ObjectId 
    firstName:string 
    secondName:string 
    bloodGroup:string
    dob:Date 
    age:number 
    gender:string 
    image:string 
    appointment?:ObjectId
}

 export interface  IPatientData {
    _id?:string
    id?:string
    userId:Types.ObjectId | UserDoc
    firstName:string 
    secondName:string 
    bloodGroup:string
    dob:Date 
    age:number 
    gender:string 
    image:string 
    appointment?:ObjectId
}

export interface UpdatePatientData {
    firstName:string 
    secondName:string 
    bloodGroup:string
    dob:Date 
    age:number 
    gender:string 
    image:string 
}