import AppointmentRepository from "../repositories/appointmentRepositories";
import ScheduleRepository from "../repositories/scheduleRepository";
import { AppointmentDoc, IAppointment} from '../interfaces/IAppointment';
import { Res } from '../interfaces/Icommon';
import UserRepository from "../repositories/userRepositories";
import { History } from "../interfaces/IUser";

class AppointmentServices {
    private appointmentRepo: AppointmentRepository;
    private scheduleRepo : ScheduleRepository
    private userRepo: UserRepository

    constructor(appointmentRepo: AppointmentRepository,scheduleRepo : ScheduleRepository,userRepo:UserRepository) {
        this.appointmentRepo = appointmentRepo;
        this.scheduleRepo = scheduleRepo
        this.userRepo = userRepo
    }

    async confirmBooking(data: IAppointment,slot_id:string | undefined,scheduleId:string): Promise<Res | null> {
        try {

            const appointmentData:AppointmentDoc | null = await this.appointmentRepo.createAppointment(data)
            await this.scheduleRepo.changeScheduleIsReserved(scheduleId,data.day,slot_id)

            return{data:appointmentData,status:true,message:'Booked Successfully'}
        } catch (error) {
            console.error("Error in createAppointment:", error);
            throw error;
        }
    }

    async getAppointmentData(_id:string): Promise<Res | null> {
        try {
           const appointmentData:AppointmentDoc | null = await this.appointmentRepo.findAppointmentById(_id)
           if(!appointmentData) return {status:false,message:"Couldn't get the data"}
            return{data:appointmentData,status:true,message:'Appointment Data get successfully'}
        } catch (error) {
            console.error("Error in createAppointment:", error);
            throw error;
        }
    }

    async userAppointmentHistory(userId:string): Promise<Res | null> {
        try {
           const appointmentData:AppointmentDoc[] | null = await this.appointmentRepo.findAppointmentsByUserId(userId)
           if(!appointmentData) return {status:false,message:"Couldn't get the data"}
            return{data:appointmentData,status:true,message:'User appointment booking history'}
        } catch (error) {
            console.error("Error in createAppointment:", error);
            throw error;
        }
    }

    async cancelBooking(_id:string,data:History): Promise<Res | null> {
        try {

           const appointmentData:AppointmentDoc | null = await this.appointmentRepo.cancelBooking(_id)
           if(!appointmentData) return {status:false,message:"Couldn't get the data"}

           await this.userRepo.updateHistory(appointmentData.userId,data)

            return{data:appointmentData,status:true,message:'Appointment Cancelled Successfully'}
        } catch (error) {
            console.error("Error in cancelBooking:", error);
            throw error;
        }
    }

    async getDoctorAppointments(_id:string): Promise<Res | null> {
        try {

           const appointmentData:AppointmentDoc[] | null = await this.appointmentRepo.findAppointmentsByDoctorId(_id)
           if(!appointmentData) return {status:false,message:"Couldn't get the data"}
           return{data:appointmentData,status:true,message:'Appointment Data get successfully'}

        } catch (error) {
            console.error("Error in getDoctorAppointments:", error);
            throw error;
        }
    }

}

export default AppointmentServices;
