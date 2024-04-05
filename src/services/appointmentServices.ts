import AppointmentRepository from "../repositories/appointmentRepositories";
import { AppointmentDoc, IAppointment} from '../interfaces/IAppointment';
import { Res } from '../interfaces/Icommon';

class AppointmentServices {
    private appointmentRepo: AppointmentRepository;

    constructor(appointmentRepo: AppointmentRepository) {
        this.appointmentRepo = appointmentRepo;
    }

    async   createAppointment(data: IAppointment): Promise<Res | null> {
        try {
            const appointmentData:AppointmentDoc | null = await this.appointmentRepo.createAppointment(data)
            return{data:appointmentData,status:true,message:'Booked Successfully'}
        } catch (error) {
            console.error("Error in createAppointment:", error);
            return null;
        }
    }

}

export default AppointmentServices;
