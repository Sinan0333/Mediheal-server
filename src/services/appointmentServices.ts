import AppointmentRepository from "../repositories/appointmentRepositories";
import ScheduleRepository from "../repositories/scheduleRepository";
import { AppointmentDoc, IAppointment, statusWiseAppointmentsCount, typeWiseAppointmentsCount} from '../interfaces/IAppointment';
import { FilterCondition, Res } from '../interfaces/Icommon';
import UserRepository from "../repositories/userRepositories";
import { History } from "../interfaces/IUser";
import { ObjectId } from "mongodb";

class AppointmentServices {
    private appointmentRepo: AppointmentRepository;
    private scheduleRepo : ScheduleRepository
    private userRepo: UserRepository

    constructor(appointmentRepo: AppointmentRepository,scheduleRepo : ScheduleRepository,userRepo:UserRepository) {
        this.appointmentRepo = appointmentRepo;
        this.scheduleRepo = scheduleRepo
        this.userRepo = userRepo
    }

    async confirmBooking(data: IAppointment,scheduleId:string): Promise<Res | null> {
        try {

            const appointmentData:AppointmentDoc | null = await this.appointmentRepo.createAppointment(data)
            await this.scheduleRepo.changeScheduleIsReserved(scheduleId,data.day,data.slotId,true)

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

           if(data.description === "Cancelled Booking"){
            const amount:number = data.amount
            const penalty:number = amount*0.1
            const finalAmount:number = amount-penalty
            data.amount = finalAmount
           }

           await this.userRepo.updateHistory(appointmentData.userId,data)
            return{data:appointmentData,status:true,message:'Appointment Cancelled Successfully'}

        } catch (error) {
            console.error("Error in cancelBooking:", error);
            throw error;
        }
    }

    async changeStatus(_id:string,status:string): Promise<Res | null> {
        try {

           const appointmentData:AppointmentDoc | null = await this.appointmentRepo.findOneAndChangeStatus(_id,status)
           if(!appointmentData) return {status:false,message:"Couldn't get the data"}

            return{data:appointmentData,status:true,message:'Appointment status has successfully updated'}

        } catch (error) {
            console.error("Error in changeStatus:", error);
            throw error;
        }
    }


    async cancelBookingWhenBreak(slotId:string): Promise<Res | null> {
        try {

           const appointmentData:IAppointment[] | [] = await this.appointmentRepo.findAppointmentsBySlotId(""+slotId)           
           const filterAppointmentData:IAppointment[] | [] = appointmentData.filter((doc)=>doc.status==='Pending')

            for(let i=0;i<filterAppointmentData.length;i++){
                await this.userRepo.updateHistory(filterAppointmentData[i].userId,{date:new Date(),description:"Doctor Cancelled the Appointment",amount:filterAppointmentData[i].doctor.fees})
                await this.appointmentRepo.cancelBooking(filterAppointmentData[i]._id)
            }

            return{data:appointmentData,status:true,message:'Appointment Cancelled Successfully'}
            
        } catch (error) {
            console.error("Error in cancelBookingWhenBreak:", error);
            throw error;
        }
    }

    async getDoctorAppointments(_id:string,filterCondition:FilterCondition): Promise<Res | null> {
        try {

           const appointmentData:AppointmentDoc[] | [] = await this.appointmentRepo.findAppointmentsByDoctorId(_id,filterCondition)
           return{data:appointmentData,status:true,message:'Appointment Data get successfully'}

        } catch (error) {
            console.error("Error in getDoctorAppointments:", error);
            throw error;
        }
    }

    async getDoctorPatients(_id:string): Promise<ObjectId[]> {
        try {

           const appointmentData:AppointmentDoc[] | null = await this.appointmentRepo.findAppointmentsByDoctorId(_id)
           const patientId:ObjectId[] = appointmentData.map((app)=>app.patient._id)
           const uniquePatientId:ObjectId[] = [...new Set(patientId)]
           return uniquePatientId

        } catch (error) {
            console.error("Error in getDoctorPatients:", error);
            throw error;
        }
    }

    async changeChatStatus(_id:string,chat:boolean): Promise<Res | null> {
        try {

           const appointmentData:AppointmentDoc | null = await this.appointmentRepo.changeChatStatus(_id,chat)
           if(!appointmentData) return {status:false,message:"Couldn't get the data"}
           return{data:appointmentData,status:true,message:'Appointment Data get successfully'}

        } catch (error) {
            console.error("Error in v:", error);
            throw error;
        }
    }

    async totalDoctorAppointments(doctor:string,filterCondition:FilterCondition): Promise<Res> {
        try {

            const count:Number = await this.appointmentRepo.countDoctorDocuments(doctor,filterCondition);
            return { data: count, status: true, message: "Total Doctor Appointments count" };

        } catch (error) {
            console.error("Error in countDocuments:", error);
            throw error;
        }
    }

    async getMonthlyRevenue(percentage:number,doctor?:string): Promise<Res | null> {
        try {

            const currentYear = new Date().getFullYear();
           const appointmentData:AppointmentDoc[] | [] = await this.appointmentRepo.findAppointmentByYear(currentYear,doctor)

           const monthlyRevenue = appointmentData.reduce((result:any, appointment) => {
            const month = appointment.bookedDate.getMonth(); 
            const fees:number = appointment.fees || 0
            const revenue:number = fees*percentage      
            result[month] = (result[month] || 0) + revenue;
            return result;
          }, {});

           return{data:monthlyRevenue,status:true,message:'Monthly Appointment Revenue get successfully'}

        } catch (error) {
            console.error("Error in getMonthlyRevenue:", error);
            throw error;
        }
    }

    async statusWiseAppointmentsCount(doctor?:string): Promise<Res | null> {
        try {

            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth() + 1; 
            const startDateOfMonth = new Date(currentYear, currentMonth - 1, 1); 
            const endDateOfMonth = new Date(currentYear, currentMonth, 0); 

           const appointmentData:statusWiseAppointmentsCount[] | [] = await this.appointmentRepo.findStatusWiseAppointmentCount(startDateOfMonth,endDateOfMonth,doctor)
           for(let i=0;i<appointmentData.length;i++){
               appointmentData[i].id = i
               appointmentData[i].color = '#'+Math.floor(Math.random()*16777215).toString(16)
           }
           
           return{data:appointmentData,status:true,message:'Status Wise Appointments Count get successfully'}

        } catch (error) {
            console.error("Error in statusWiseAppointmentsCount:", error);
            throw error;
        }
    }

    async typeWiseAppointmentsCount(doctor?:string): Promise<Res | null> {
        try {

            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth() + 1; 
            const startDateOfMonth = new Date(currentYear, currentMonth - 1, 1); 
            const endDateOfMonth = new Date(currentYear, currentMonth, 0); 

           const appointmentData:typeWiseAppointmentsCount[] | [] = await this.appointmentRepo.findTypeWiseAppointmentCount(startDateOfMonth,endDateOfMonth,doctor)
           return{data:appointmentData,status:true,message:'Type Wise Appointments Count get successfully'}

        } catch (error) {
            console.error("Error in statusWiseAppointmentsCount:", error);
            throw error;
        }
    }


}

export default AppointmentServices;
