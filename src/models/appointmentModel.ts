import {Schema,model} from 'mongoose'
import { AppointmentDoc } from '../interfaces/IAppointment'


const appointmentSchema = new Schema <AppointmentDoc>({
    schedule:{
        type:Schema.Types.ObjectId,
        ref:'Schedule',
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

