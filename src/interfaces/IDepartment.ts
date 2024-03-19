import {Document} from 'mongoose'

export interface DepartmentDoc extends Document{
   name:string
   title:string
   description:string
   logo:string
   image:string
}




