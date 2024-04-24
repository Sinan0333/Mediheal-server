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
            const {startTime, endTime, day, doctor, patient, type ,userId,bookedDate,slotId}: IAppointment = req.body; 
            
            const result: Res | null = await this.appointmentServices.confirmBooking({userId,slotId,startTime,endTime,day,doctor,patient,bookedDate,type,status:"Pending"},scheduleId);
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

    async userAppointmentHistory(req:Request,res:Response):Promise<void>{
        try {
            
            const {userId} = req.params
            const result: Res | null = await this.appointmentServices.userAppointmentHistory(userId)  
            res.json(result)
            
        } catch (error) {
            console.error("Error in appointmentController.userAppointmentHistory", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async cancelBooking(req:Request,res:Response):Promise<void>{
        try {
            
            const {_id} = req.params
            const data = req.body
            const result: Res | null = await this.appointmentServices.cancelBooking(_id,data)  
            res.json(result)
            
        } catch (error) {
            console.error("Error in appointmentController.cancelBooking", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async changeStatus(req:Request,res:Response):Promise<void>{
        try {
            
            const _id: string = req.query._id as string;
            const status: string = req.query.status as string;

            const result: Res | null = await this.appointmentServices.changeStatus(_id,status)  
            res.json(result)
            
        } catch (error) {
            console.error("Error in appointmentController.changeStatus", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async getDoctorAppointments(req:Request,res:Response):Promise<void>{
        try {
            
            const {_id} = req.params
            const result: Res | null = await this.appointmentServices.getDoctorAppointments(_id)  
            res.json(result)
            
        } catch (error) {
            console.error("Error in appointmentController.getDoctorAppointments", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async cancelBookingWhenBreak(req:Request,res:Response):Promise<void>{
        try {
            
            const {_id} = req.params
            const result: Res | null = await this.appointmentServices.cancelBookingWhenBreak(_id)  
            res.json(result)
            
        } catch (error) {
            console.error("Error in appointmentController.cancelBookingWhenBreak", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }


}


export default AppointmentController