import {Schema,model} from 'mongoose'
import { DepartmentDoc } from '../interfaces/IDepartment'

const DepartmentSchema = new Schema <DepartmentDoc>({
    name:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    logo:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    is_blocked:{
        type:Boolean,
        default:false,
    }
    
})

export default  model<DepartmentDoc>('Department',DepartmentSchema)

