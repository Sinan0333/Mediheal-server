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
            
            const {startTime,endTime,day,doctor,patient,type}:IAppointment = req.body

            const result: Res | null = await this.appointmentServices.createAppointment({startTime,endTime,day,doctor,patient,type,status:"Pending"})  
            res.json(result)
            
        } catch (error) {
            console.error("Error in appointmentController.createAppointment:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async getAppointmentData(req:Request,res:Response):Promise<void>{
        try {
            
            const {_id} = req.params
            const result: Res | null = await this.appointmentServices.getAppointmentData(_id)  
            res.json(result)
            
        } catch (error) {
            console.error("Error in appointmentController.getAppointmentData", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

}


export default AppointmentController