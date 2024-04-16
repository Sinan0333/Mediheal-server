import { AppointmentDoc, IAppointment } from "../interfaces/IAppointment";
import Appointment from "../models/appointmentModel";

class AppointmentRepository {

    async findAppointmentById(_id:string): Promise<AppointmentDoc | null> {
        try {
            const appointmentData:AppointmentDoc | null = await Appointment.findOne({ _id}).populate('schedule.thursday doctor patient')
            return appointmentData;
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

    async findAppointmentsByUserId(userId:string): Promise<AppointmentDoc[]> {
        try {
            const appointmentData:AppointmentDoc[] | null = await Appointment.find({ userId}).populate('doctor patient')
            return appointmentData;
        } catch (error) {
            console.error("Error in findAppointmentsByUserId:", error);
            throw error;
        }
    }

    async cancelBooking(_id:string): Promise<AppointmentDoc | null> {
        try {
            const appointmentData:AppointmentDoc | null = await Appointment.findOneAndUpdate({_id},{status:"Cancelled"})
            return appointmentData;
        } catch (error) {
            console.error("Error in cancelBooking:", error);
            throw error;
        }
    }
    
}

export default AppointmentRepository;