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
        type:[Number],
        required:true
    },
    slots:{
        type:Schema.Types.ObjectId,
        ref:'Schedule',
        required:true
    },
    schedule:{
        startTime:{
            type:Number,
            required:true
        },
        endTime:{
            type:Number,
            required:true
        },
        interval:{
            type:Number,
            required:true
        } 
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
    },
    role:{
        type:String,
        default:'doctor'
    }
    
})

export default  model<DoctorDoc>('Doctor',DoctorSchema)

