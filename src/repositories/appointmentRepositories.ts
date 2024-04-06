import { AppointmentDoc, IAppointment } from "../interfaces/IAppointment";
import Appointment from "../models/appointmentModel";

class AppointmentRepository {

    async findAppointmentById(_id:string): Promise<AppointmentDoc | null> {
        try {
            const otpData:AppointmentDoc | null = await Appointment.findOne({ _id}).populate('schedule.thursday doctor patient')
            return otpData;
        } catch (error) {
            console.error("Error in findAppointmentById:", error);
            throw error;
        }
    }

    async createAppointment(data:IAppointment): Promise<AppointmentDoc> {
        try {
            const appointmentModel = new Appointment(data);
            const savedAppointment:AppointmentDoc = await appointmentModel.save();
            return savedAppointment;
        } catch (error) {
            console.error("Error in createAppointment:", error);
            throw error;
        }
    }
    
}

export default AppointmentRepository;
