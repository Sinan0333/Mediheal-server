import {Request,Response} from "express"
import AppointmentServices from "../services/appointmentServices";
import {IAppointment } from '../interfaces/IAppointment';
import { Res } from '../interfaces/Icommon';


class AppointmentController{
    private appointmentServices:AppointmentServices

    constructor(appointmentServices:AppointmentServices){
        this.appointmentServices = appointmentServices
    }

    async confirmBooking(req: Request, res: Response): Promise<void> {
        try {
            const {scheduleId} = req.params
            const {_id, startTime, endTime, day, doctor, patient, type }: IAppointment = req.body; 
            
            const result: Res | null = await this.appointmentServices.confirmBooking({startTime,endTime,day,doctor,patient,type,status:"Pending"},_id,scheduleId);
            res.json(result);

        } catch (error) {
            console.error("Error in appointmentController.confirmBooking", error);
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