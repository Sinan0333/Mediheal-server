import { Types ,Document} from "mongoose"
import { DoctorDoc } from "./IDoctor"
import { PatientDoc } from "./IPatient"

export interface AppointmentDoc extends Document{
    slotId:string
    userId:Types.ObjectId
    startTime:string
    endTime:string
    day:string
    doctor:Types.ObjectId
    patient:Types.ObjectId
    bookedDate:Date
    fees:number
    chat:boolean
    status:"Pending" | "Checked" | "Cancelled"
    type:"online" | "offline"
}

export interface IAppointment {
    slotId:string
    userId:Types.ObjectId
    _id?:string
    startTime:string
    endTime:string
    day:string
    doctor: DoctorDoc
    patient:PatientDoc
    chat:boolean
    bookedDate:Date
    fees:number
    status:"Pending" | "Checked" | "Cancelled"
    type:"online" | "offline"
}


export interface statusWiseAppointmentsCount{
    id:number
    label:string
    value:number
    color:string
}