import AppointmentRepository from "../repositories/appointmentRepositories";
import ScheduleRepository from "../repositories/scheduleRepository";
import { AppointmentDoc, IAppointment} from '../interfaces/IAppointment';
import { Res } from '../interfaces/Icommon';

class AppointmentServices {
    private appointmentRepo: AppointmentRepository;
    private scheduleRepo : ScheduleRepository

    constructor(appointmentRepo: AppointmentRepository,scheduleRepo : ScheduleRepository) {
        this.appointmentRepo = appointmentRepo;
        this.scheduleRepo = scheduleRepo
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
            return{data:appointmentData,status:true,message:'Booked Successfully'}
        } catch (error) {
            console.error("Error in createAppointment:", error);
            throw error;
        }
    }

}

export default AppointmentServices;
