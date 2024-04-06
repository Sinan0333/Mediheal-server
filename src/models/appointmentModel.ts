import {Schema,model} from 'mongoose'
import { AppointmentDoc } from '../interfaces/IAppointment'


const appointmentSchema = new Schema <AppointmentDoc>({

    startTime:{
        type:String,
        required:true
    },
    endTime:{
        type:String,
        required:true
    },
    day:{
        type:String,
        required:true
    },
    doctor:{
        type:Schema.Types.ObjectId,
        ref:"Doctor",
        required:true
    },
    patient:{
        type:Schema.Types.ObjectId,
        ref:"Patient",
        required:true
    },
    status:{
        type:String,
        default:"Pending"
    },
    type:{
        type:String,
        required:true
    }
})

export default  model<AppointmentDoc>('Appointment',appointmentSchema)

