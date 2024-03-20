import {Document, ObjectId} from 'mongoose'

export interface DepartmentDoc extends Document{
   name:string
   title:string
   description:string
   logo:string
   image:string
   is_blocked:boolean
}

export interface IDepartmentData {
   _id?:ObjectId
   name:string
   title:string
   description:string
   logo:string
   image:string
   is_blocked?:Boolean
}

// export DepartmentListData {

// }

