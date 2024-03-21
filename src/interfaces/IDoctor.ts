import {Document, ObjectId} from 'mongoose'

export interface DoctorDoc extends Document{
   firstName:string
   lastName:string
   dob:Date
   image:string
   phone:Number
   email:string
   address:string
   gender:string
   experience:number
   department:ObjectId
   password:string
   workingDays:string[]
   schedule:ObjectId
   workingTime:object[]
}




