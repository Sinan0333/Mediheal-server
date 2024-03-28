import {Schema,model} from 'mongoose'
import { DoctorDoc } from '../interfaces/IDoctor'

const DoctorSchema = new Schema <DoctorDoc>({
    firstName:{
        type:String,
        required:true
    },
    secondName:{
        type:String,
        required:true
    },
    dob:{
        type:Date,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    experience:{
        type:Number,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    department:{
        type: Schema.Types.ObjectId, 
        ref: 'Department', 
        required: true
    },
    workingDays:{
        type:[String],
        required:true
    },
    fees:{
        type:Number,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    is_blocked:{
        type:Boolean,
        default:false
    }
    
})

export default  model<DoctorDoc>('Doctor',DoctorSchema)

