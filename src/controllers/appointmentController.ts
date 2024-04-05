import {Request,Response} from "express"
import AppointmentServices from "../services/appointmentServices";
import {IAppointment } from '../interfaces/IAppointment';
import { Res } from '../interfaces/Icommon';



class AppointmentController{
    private appointmentServices:AppointmentServices

    constructor(appointmentServices:AppointmentServices){
        this.appointmentServices = appointmentServices
    }


    async createAppointment(req:Request,res:Response):Promise<void>{
        try {
            
            const {schedule,doctor,patient,type}:IAppointment = req.body
            const result: Res | null = await this.appointmentServices.createAppointment({schedule,doctor,patient,type,status:"Pending"})  
            res.json(result)
            
        } catch (error) {
            console.error("Error in Department.addDepartment:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

}


export default AppointmentController