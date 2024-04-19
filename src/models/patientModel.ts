import {Schema,model} from 'mongoose'
import { PatientDoc } from '../interfaces/IPatient'

const PatientSchema = new Schema <PatientDoc>({
    id:{
        type:String,
        required:true,
        unique:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
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
    image:{
        type:String,
        default:""
    },
    appointment:{
        type:Schema.Types.ObjectId,
        ref:'Appointment',
    }
})

export default  model<PatientDoc>('Patient',PatientSchema)

