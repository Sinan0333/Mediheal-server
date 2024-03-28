import {Document, Types} from 'mongoose'
import { DepartmentDoc } from './IDepartment'

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
   workingDays:string[]
   fees:number
   image:string 
   is_blocked:boolean
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
   workingDays:string[]
   fees:number
   image:string
}


export interface DoctorRes{
   userData?:DoctorDoc
   token?:string
   status:true | false
   message:string
}



