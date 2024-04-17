import { Types ,Document} from "mongoose"
import { DoctorDoc } from "./IDoctor"
import { PatientDoc } from "./IPatient"
import { UserDoc } from "./IUser"

export interface AppointmentDoc extends Document{
    slotId:string
    userId:Types.ObjectId
    startTime:string
    endTime:string
    day:string
    doctor:Types.ObjectId
    patient:Types.ObjectId
    bookedDate:Date
    status:"Pending" | "Checked" | "Cancelled"
    type:"online" | "offline"
}

export interface IAppointment {
    slotId:string
    userId:Types.ObjectId | UserDoc
    _id?:string
    startTime:string
    endTime:string
    day:string
    doctor:Types.ObjectId | DoctorDoc
    patient:Types.ObjectId |PatientDoc
    bookedDate:Date
    status:"Pending" | "Checked" | "Cancelled"
    type:"online" | "offline"
}
