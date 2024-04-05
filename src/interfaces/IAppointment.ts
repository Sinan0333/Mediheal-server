import { Types ,Document} from "mongoose"
import { ScheduleDoc } from "./Ischedule"
import { DoctorDoc } from "./IDoctor"
import { PatientDoc } from "./IPatient"

export interface AppointmentDoc extends Document{
    schedule:Types.ObjectId
    doctor:Types.ObjectId
    patient:Types.ObjectId
    status:"Pending" | "Checked" | "Cancelled"
    type:"online" | "offline"
}

export interface IAppointment {
    schedule:Types.ObjectId | ScheduleDoc
    doctor:Types.ObjectId | DoctorDoc
    patient:Types.ObjectId |PatientDoc
    status:"Pending" | "Checked" | "Cancelled"
    type:"online" | "offline"
}