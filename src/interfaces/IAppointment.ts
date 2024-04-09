import { Types ,Document} from "mongoose"
import { DoctorDoc } from "./IDoctor"
import { PatientDoc } from "./IPatient"

export interface AppointmentDoc extends Document{
    startTime:string
    endTime:string
    day:string
    doctor:Types.ObjectId
    patient:Types.ObjectId
    status:"Pending" | "Checked" | "Cancelled"
    type:"online" | "offline"
}

export interface IAppointment {
    _id?:string
    startTime:string
    endTime:string
    day:string
    doctor:Types.ObjectId | DoctorDoc
    patient:Types.ObjectId |PatientDoc
    status:"Pending" | "Checked" | "Cancelled"
    type:"online" | "offline"
}
