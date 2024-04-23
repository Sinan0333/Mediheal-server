import { Types } from "mongoose"
import { PatientDoc } from "./IPatient"
import { AppointmentDoc } from "./IAppointment"
import { DoctorDoc } from "./IDoctor"

export interface PrescriptionDoc extends Document{
    patient:Types.ObjectId
    appointment:Types.ObjectId
    doctor:Types.ObjectId
    weight:number
    height:number
    bloodPressure:number
    bodyTemperature:number
    diagnosis:Diagnosis[]
    medicines:Medicines[]
}

export interface IPrescriptionData{
    patient:Types.ObjectId | PatientDoc
    appointment:Types.ObjectId | AppointmentDoc
    doctor:Types.ObjectId | DoctorDoc
    weight:number
    height:number
    bloodPressure:number
    bodyTemperature:number
    diagnosis:Diagnosis[]
    medicines:Medicines[]
}

export interface Diagnosis {
    name:string
    instruction:string
}

export interface Medicines {
    name:string
    type:string
    instruction:string
    days:number
}