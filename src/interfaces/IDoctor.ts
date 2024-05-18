import {Document, ObjectId, Types} from 'mongoose'
import { DepartmentDoc } from './IDepartment'

export interface ScheduleType {
   startTime:number
   endTime:number
   interval:number
}


export interface DoctorDoc extends Document{
   _id?:string
   firstName:string 
   secondName:string 
   dob:Date 
   age:number 
   gender:string 
   address:string 
   experience:number 
   phone:number 
   email:string 
   password:string
   department:Types.ObjectId 
   workingDays:number[]
   slots:ObjectId
   schedule:ScheduleType
   fees:number
   image:string 
   is_blocked:boolean
   role:string
}

export interface IDoctorData {
   _id?:string
   firstName:string 
   secondName:string 
   dob:Date 
   age:number 
   gender:string 
   address:string 
   experience:number 
   phone:number 
   email:string 
   password:string
   department:Types.ObjectId | DepartmentDoc
   workingDays:number[]
   slots?:ObjectId
   schedule:ScheduleType
   fees:number
   image:string
}


export interface DoctorRes{
   userData?:DoctorDoc
   token?:string
   refreshToken?:string
   status:true | false
   message:string
}



