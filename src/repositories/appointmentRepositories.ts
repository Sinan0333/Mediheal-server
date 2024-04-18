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

    async cancelBooking(_id:string | undefined): Promise<AppointmentDoc | null> {
        try {
            const appointmentData:AppointmentDoc | null = await Appointment.findOneAndUpdate({_id},{status:"Cancelled"})
            return appointmentData;
        } catch (error) {
            console.error("Error in cancelBooking:", error);
            throw error;
        }
    }

    async cancelBookingBySlotId(slotId:string): Promise<AppointmentDoc | null> {
        try {
            const appointmentData:AppointmentDoc | null = await Appointment.findOneAndUpdate({slotId},{status:"Cancelled"})
            return appointmentData;
        } catch (error) {
            console.error("Error in cancelBookingBySlotId:", error);
            throw error;
        }
    }

    async findAppointmentsByDoctorId(doctor:string): Promise<AppointmentDoc[]> {
        try {
            const appointmentData:AppointmentDoc[] | null = await Appointment.find({ doctor}).populate('patient doctor')
            return appointmentData;
        } catch (error) {
            console.error("Error in findAppointmentsByDoctorId:", error);
            throw error;
        }
    }

    async findAppointmentsBySlotId(slotId:string): Promise<IAppointment[]> {
        try {
            const appointmentData:IAppointment[] | [] = await Appointment.find({ slotId}).populate('patient doctor')
            return appointmentData;
        } catch (error) {
            console.error("Error in findAppointmentsBySlotId:", error);
            throw error;
        }
    }
    
}

export default AppointmentRepository;
