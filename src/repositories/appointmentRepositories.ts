import { AppointmentDoc, IAppointment, statusWiseAppointmentsCount, typeWiseAppointmentsCount } from "../interfaces/IAppointment";
import { FilterCondition } from "../interfaces/Icommon";
import Appointment from "../models/appointmentModel";
import {ObjectId} from 'mongodb'

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

    async cancelBooking(_id:ObjectId | undefined): Promise<AppointmentDoc | null> {
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

    async findAppointmentsByDoctorId(doctor:string,filterCondition?:FilterCondition): Promise<AppointmentDoc[]> {
        try {

            const query:any = {}
            const sort:any = {}
            const skip:number = filterCondition ? (filterCondition.page - 1) * 13 : 0;
            query.doctor = doctor
            if(filterCondition && filterCondition.filterData && filterCondition.filterData !== "default" && filterCondition.filterData !== "null"){
                query.day = filterCondition.filterData
            }
            if(filterCondition &&filterCondition.sortBy && filterCondition.sortBy !== "default" && filterCondition.sortBy !== "null" && filterCondition.sortIn && filterCondition.sortIn !== "default" &&filterCondition.sortIn !== "null"){
                sort[filterCondition.sortBy] = parseInt(filterCondition.sortIn)
            }else{
                sort.bookedDate= -1
            }

            const appointmentData:AppointmentDoc[] | null = await Appointment.find(query).skip(skip).limit(13).populate('patient doctor').sort(sort)
            return appointmentData;
        } catch (error) {
            console.error("Error in findAppointmentsByDoctorId:", error);
            throw error;
        }
    }

    async findAppointmentsBySlotIdAndStatus(slotId:string,status:string): Promise<AppointmentDoc[]> {
        try {
            const appointmentData:AppointmentDoc[] | [] = await Appointment.find({ slotId,status}).populate('patient doctor')
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

    async countDoctorDocuments(doctor:string,filterCondition:FilterCondition): Promise<Number> {
        try {

            const query:any = {}
            query.doctor = doctor
            if(filterCondition && filterCondition.filterData && filterCondition.filterData !== "default" && filterCondition.filterData !== "null"){
                query.day = filterCondition.filterData
            }

            const count:Number  = await Appointment.countDocuments(query).exec();
            return count;
        } catch (error) {
            console.error("Error in countDocuments:", error);
            throw error;
        }
    }

    async findAppointmentByYear(year:number,doctor?:string): Promise<AppointmentDoc[] | []> {
        try {

            const filter:any = {
                bookedDate: {
                    $gte: new Date(`${year}-01-01`),
                    $lt: new Date(`${year + 1}-01-01`)
                  }
            }

            if(doctor){
                filter.doctor = doctor
            }

            const appointmentData:AppointmentDoc[] | [] = await Appointment.find(filter)
            return appointmentData;
        } catch (error) {
            console.error("Error in findAppointmentByYear:", error);
            throw error;
        }
    }

    async findStatusWiseAppointmentCount(startDateOfMonth:Date,endDateOfMonth:Date,doctor?:string): Promise<statusWiseAppointmentsCount[] | []> {
        try {

            const matchStage:any = {
                bookedDate: {
                    $gte: startDateOfMonth,
                    $lte: endDateOfMonth
                }
            };
    
            if (doctor) {
                matchStage.doctor = new ObjectId(doctor);
            }
            
            const pipeline = [
                {
                    $match: matchStage
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

    async findTypeWiseAppointmentCount(startDateOfMonth:Date,endDateOfMonth:Date,doctor?:string): Promise<typeWiseAppointmentsCount[] | []> {
        try {

            const matchStage:any = {
                bookedDate: {
                    $gte: startDateOfMonth,
                    $lte: endDateOfMonth
                }
            };
    
            if (doctor) {
                matchStage.doctor = new ObjectId(doctor);
            }

            const pipeline = [
                {
                    $match: matchStage
                },
                {
                    $group: {
                        _id: "$type",
                        count: { $sum: 1 } 
                    }
                },
                {
                    $project: {
                        type: "$_id",
                        count:1,
                        _id: 0 
                    }
                }
            ];

            const appointmentData:typeWiseAppointmentsCount[] | [] = await Appointment.aggregate(pipeline)
            return appointmentData;
        } catch (error) {
            console.error("Error in findStatusWiseAppointmentCount:", error);
            throw error;
        }
    }
    
}

export default AppointmentRepository;
