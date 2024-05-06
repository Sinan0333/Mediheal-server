import { AppointmentDoc, IAppointment, statusWiseAppointmentsCount } from "../interfaces/IAppointment";
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
            const appointmentData:AppointmentDoc[] | null = await Appointment.find({ userId}).populate('doctor patient').sort({bookedDate:-1})
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

    async findOneAndChangeStatus(_id:string,status:string): Promise<AppointmentDoc | null> {
        try {
            const appointmentData:AppointmentDoc | null = await Appointment.findOneAndUpdate({_id},{status})
            return appointmentData;
        } catch (error) {
            console.error("Error in findOneAndChangeStatus:", error);
            throw error;
        }
    }

    async findAppointmentsByDoctorId(doctor:string): Promise<AppointmentDoc[]> {
        try {
            const appointmentData:AppointmentDoc[] | null = await Appointment.find({ doctor}).populate('patient doctor').sort({bookedDate:-1})
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

    async changeChatStatus(_id:string,chat:boolean): Promise<AppointmentDoc | null> {
        try {
            const appointmentData:AppointmentDoc | null = await Appointment.findOneAndUpdate({_id},{chat}).populate('patient doctor')
            return appointmentData;
        } catch (error) {
            console.error("Error in changeChatStatus:", error);
            throw error;
        }
    }

    async findAppointmentByYear(year:number): Promise<AppointmentDoc[] | []> {
        try {
            const appointmentData:AppointmentDoc[] | [] = await Appointment.find({
                bookedDate: {
                    $gte: new Date(`${year}-01-01`),
                    $lt: new Date(`${year + 1}-01-01`)
                  },
                  status: { $ne: 'Cancelled' } 
            })
            return appointmentData;
        } catch (error) {
            console.error("Error in findAppointmentByYear:", error);
            throw error;
        }
    }

    async findStatusWiseAppointmentCount(startDateOfMonth:Date,endDateOfMonth:Date): Promise<statusWiseAppointmentsCount[] | []> {
        try {
            const pipeline = [
                {
                    $match: {
                        bookedDate: {
                            $gte: startDateOfMonth,
                            $lte: endDateOfMonth
                        }
                    }
                },
                {
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 } 
                    }
                },
                {
                    $project: {
                        label: "$_id",
                        value: "$count",
                        _id: 0 
                    }
                }
            ];

            const appointmentData:statusWiseAppointmentsCount[] | [] = await Appointment.aggregate(pipeline)
            return appointmentData;
        } catch (error) {
            console.error("Error in findStatusWiseAppointmentCount:", error);
            throw error;
        }
    }
    
}

export default AppointmentRepository;
