import {Request,Response} from "express"
import AppointmentServices from "../services/appointmentServices";
import PatientServices from "../services/patientServices";
import {IAppointment } from '../interfaces/IAppointment';
import { Res } from '../interfaces/Icommon';
import { ObjectId } from "mongodb";


class AppointmentController{
    private appointmentServices:AppointmentServices
    private patientServices:PatientServices

    constructor(appointmentServices:AppointmentServices,patientServices:PatientServices){
        this.appointmentServices = appointmentServices
        this.patientServices = patientServices
    }

    async confirmBooking(req: Request, res: Response): Promise<void> {
        try {
            const {scheduleId} = req.params
            const {startTime, endTime, day, doctor, patient, type ,userId,bookedDate,fees,slotId}: IAppointment = req.body; 
            
            const result: Res | null = await this.appointmentServices.confirmBooking({userId,slotId,startTime,endTime,day,doctor,patient,bookedDate,fees,chat:false,type,status:"Pending"},scheduleId);
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

    async changeChatStatus(req:Request,res:Response):Promise<void>{
        try {
            const{_id,chat} = req.body
            const result: Res | null = await this.appointmentServices.changeChatStatus(_id,chat)  
            res.json(result)
            
        } catch (error) {
            console.error("Error in appointmentController.changeChatStatus", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async doctorPatients(req:Request,res:Response):Promise<void>{
        try {
            const{_id} = req.params
            const patientID: ObjectId[]  = await this.appointmentServices.getDoctorPatients(_id)

            const result:Res | null = await this.patientServices.doctorPatients(patientID)
            res.json(result)
            
        } catch (error) {
            console.error("Error in appointmentController.doctorPatients", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async totalDoctorPatients(req:Request,res:Response):Promise<void>{
        try {
            const{_id} = req.params
            const patientID: ObjectId[]  = await this.appointmentServices.getDoctorPatients(_id)

            const result:Res | null = await this.patientServices.totalDoctorPatients(patientID)
            res.json(result)
            
        } catch (error) {
            console.error("Error in appointmentController.totalDoctorPatients", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async totalDoctorAppointments(req:Request,res:Response):Promise<void>{
        try {
            const {_id} = req.params
            const result: Res | null = await this.appointmentServices.totalDoctorAppointments(_id)  
            res.json(result)
            
        } catch (error) {
            console.error("Error in BedController.totalBeds:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async getMonthlyRevenue(_req:Request,res:Response):Promise<void>{
        try {
            const result: Res | null = await this.appointmentServices.getMonthlyRevenue(0.2)  
            res.json(result)
            
        } catch (error) {
            console.error("Error in appointmentController.getMonthlyRevenue", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async statusWiseAppointmentsCount(_req:Request,res:Response):Promise<void>{
        try {
            const result: Res | null = await this.appointmentServices.statusWiseAppointmentsCount()  
            res.json(result)
            
        } catch (error) {
            console.error("Error in appointmentController.statusWiseAppointmentsCount", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async typeWiseAppointmentsCount(_req:Request,res:Response):Promise<void>{
        try {
            const result: Res | null = await this.appointmentServices.typeWiseAppointmentsCount()  
            res.json(result)
            
        } catch (error) {
            console.error("Error in appointmentController.typeWiseAppointmentsCount", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async getDoctorMonthlyRevenue(req:Request,res:Response):Promise<void>{
        try {
            const {_id} = req.params
            const result: Res | null = await this.appointmentServices.getMonthlyRevenue(0.8,_id)  
            res.json(result)
            
        } catch (error) {
            console.error("Error in appointmentController.getDoctorMonthlyRevenue", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async statusWiseDoctorAppointmentsCount(req:Request,res:Response):Promise<void>{
        try {
            const {_id} = req.params
            const result: Res | null = await this.appointmentServices.statusWiseAppointmentsCount(_id)  
            res.json(result)
            
        } catch (error) {
            console.error("Error in appointmentController.statusWiseDoctorAppointmentsCount", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async typeWiseDoctorAppointmentsCount(req:Request,res:Response):Promise<void>{
        try {
            const {_id} = req.params
            const result: Res | null = await this.appointmentServices.typeWiseAppointmentsCount(_id)  
            res.json(result)
            
        } catch (error) {
            console.error("Error in appointmentController.typeWiseDoctorAppointmentsCount", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}


export default AppointmentController