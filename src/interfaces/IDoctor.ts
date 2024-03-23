import {Document, Types} from 'mongoose'

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
   department:Types.ObjectId
   workingDays:string[]
   fees:number
   image:string
}



