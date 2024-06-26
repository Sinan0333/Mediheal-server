import bcrypt from 'bcrypt';
import DoctorRepositories from "../repositories/doctorRepositories";
import ScheduleRepository from '../repositories/scheduleRepository';
import OtpRepository from '../repositories/otpRepositories';
import { DoctorDoc, DoctorRes, IDoctorData } from '../interfaces/IDoctor';
import { FilterCondition, Res } from '../interfaces/Icommon';
import { uploadFile } from '../utils/cloudinary';
import { generateRefreshToken, generateToken, verifyToken } from '../utils/jwt';
import { generateSlots, generateSlotsForADay } from '../utils/schedule';
import { ScheduleDoc } from '../interfaces/Ischedule';
import { removeDays } from '../utils/others';
import { sendVerifyMail } from '../utils/otpVerification';
import { OtpDoc } from '../interfaces/IOtp';

class DoctorServices {
    private doctorRepo: DoctorRepositories;
    private scheduleRepo:ScheduleRepository
    private otpRepo: OtpRepository

    constructor(doctorRepo: DoctorRepositories,scheduleRepo:ScheduleRepository,otpRepo: OtpRepository) {
        this.doctorRepo = doctorRepo;
        this.scheduleRepo = scheduleRepo
        this.otpRepo = otpRepo
    }

    async checkExistingEmail(email: string): Promise<boolean> {
        try {
            const userData:DoctorDoc | null = await this.doctorRepo.findDoctorByEmail(email);
            return !!userData;
        } catch (error) {
            console.error("Error in checkExistingEmail:", error);
            throw error;
        }
    }

    async addDoctor(data: IDoctorData): Promise<Res> {
        try {
            const { email, password } = data;

            const checkExist: boolean = await this.checkExistingEmail(email);
            if (checkExist) return { status: false, message: 'User Email already exists' };

            const hashedPass: string = await bcrypt.hash(password, 10);
            const imagePublicId:string = await uploadFile(data.image, "doctor_image");
            const slotsObject = await generateSlots(data.schedule.startTime,data.schedule.endTime,data.schedule.interval,data.workingDays)
            const slotData = await this.scheduleRepo.createSchedule(slotsObject)
            const newData: IDoctorData = { ...data, password: hashedPass,image:imagePublicId,slots:slotData?._id};

            const doctorData:DoctorDoc | null = await this.doctorRepo.createDoctor(newData);
            return { data: doctorData, status: true, message: 'Doctor registered successfully' };
        } catch (error) {
            console.error("Error in addDoctor:", error);
            throw error;
        }
    }

    async ediDoctor(data: IDoctorData,_id:string): Promise<Res> {
        try {

            let imagePublicId:string
            const oldDoctorData:IDoctorData | null = await this.doctorRepo.findDoctorById(_id)

            if(!oldDoctorData) return {status:false,message:"Cant find the doctor data"}
            if(!oldDoctorData.slots) return {status:false,message:"Cant find the doctor data"}

            const scheduleData:ScheduleDoc | null = await this.scheduleRepo.findScheduleById(oldDoctorData.slots)
            if(!scheduleData) return {status:false,message:"Cant find the schedule data"}

            if(data.image.split("/").includes('Mediheal')){
                imagePublicId=data.image
            }else{
                imagePublicId = await uploadFile(data.image,"doctor_image");
            }

            if (data.workingDays.length !== oldDoctorData?.workingDays.length) {
                if (data.workingDays.length > oldDoctorData?.workingDays.length) {
                    const addedDays: number[] = data.workingDays.filter((day: number) => !oldDoctorData.workingDays.includes(day));
                    for(let i=0;i<addedDays.length;i++){
                        generateSlotsForADay(data.schedule.startTime,data.schedule.endTime,data.schedule.interval,addedDays[i],scheduleData)
                    }
                }else{
                    const removedDays: number[] = oldDoctorData.workingDays.filter((day: number) => !data.workingDays.includes(day));
                    const response:Res | void  = removeDays(removedDays,scheduleData)
                    if(response) return response
                }
            }
                        
            const slotData = await this.scheduleRepo.findScheduleAndUpdate(oldDoctorData?.slots,scheduleData)
            
            const newData: IDoctorData = { ...data, image:imagePublicId,slots:slotData?._id };

            const doctorData:DoctorDoc | null = await this.doctorRepo.updateDoctor(newData,_id);
            return { data: doctorData, status: true, message: 'Doctor updated successfully' };

        } catch (error) {
            console.error("Error in editDoctor:", error);
            throw error;
        }
    }

    async authDoctor(email: string, password: string): Promise<DoctorRes> {
        try {
            const userData:DoctorDoc | null = await this.doctorRepo.findDoctorByEmail(email);
            if (userData) {
                const isPasswordValid = await bcrypt.compare(password, userData.password);
                if (isPasswordValid ) {
                    if(userData.is_blocked){
                        return{status:false,message:"Admin blocked you"}
                    }else{
                        const token: string = generateToken(userData);
                        const refreshToken:string = generateRefreshToken(userData)
                        return { userData, token,refreshToken, status: true, message: 'Authentication successful' };
                    }
                    
                } else {
                    return { status: false, message: 'Incorrect password' };
                }
            } else {
                return { status: false, message: 'Email not found' };
            }
        } catch (error) {
            console.error("Error in authUser:", error);
            throw error;
        }
    }

    async refreshToken(token:string): Promise<Res> {
        try {

           const decodedToken = verifyToken(token);
           const doctorData:DoctorDoc | null = await this.doctorRepo.findDoctorById(decodedToken._id)

           if(!doctorData) return {status:false,message:"Cant find the user"}
           if(doctorData.is_blocked)  throw new Error("Token verification failed")

           const accessToken:string = generateToken(doctorData)
           const refreshToken:string = generateRefreshToken(doctorData)

            return {status:true ,data:{accessToken,refreshToken} ,message:"Token refreshed"}

        } catch (error) {
            console.error("Error in refreshToken:", error);
            throw error;
        }
    }

    async listDoctors(filterCondition:FilterCondition,is_blocked?:Boolean):Promise <Res>{
        try {
            const doctorsData:DoctorDoc[] | null = await this.doctorRepo.findDoctors(filterCondition)
    
            if(is_blocked !==undefined){
                const filteredData: IDoctorData[] | undefined = doctorsData?.filter(obj => obj.is_blocked === is_blocked);
                return { data: filteredData, status: true, message: 'filtered doctors' };
            }
            return {data:doctorsData,status:true, message:"List of doctors"}

        } catch (error) {
            console.error("Error in ListDoctors", error);
            throw error;
        }
    }

    async viewDoctor(_id:string):Promise <Res>{
        try {

            const doctorsData:IDoctorData | null = await this.doctorRepo.findDoctorById(_id)
            if(!doctorsData) return {status:false,message:"Cant find the doctor data"}
            return {data:doctorsData,status:true, message:"Doctor Data"}

        } catch (error) {
            console.error("Error in ListDoctors", error);
            throw error;
        }
    }

    

    async changeBlockStatus(_id:string,is_blocked:Boolean): Promise<Res> {
        try {

            const doctorData:DoctorDoc | null = await this.doctorRepo.changeBlockStatus(_id,is_blocked)
            if(!doctorData) return {status:false,message:"Cant find the doctor data"}
            return {data:doctorData,status:true,message:`Doctor is ${is_blocked ? "blocked" : "unblocked"}`}

        } catch (error) {
            console.error("Error in changeBlockStatus:", error);
            throw error;
        }
    }

    async bestDoctors(filterCondition:FilterCondition): Promise<Res> {
        try {

            const doctorData:DoctorDoc[] | null = await this.doctorRepo.findDoctors(filterCondition)
            const filterDoctors: DoctorDoc[] | undefined = doctorData?.sort((a, b) => {
                return b.experience - a.experience;
            })
            return {data:filterDoctors,status:true,message:"Doctors is descending order based on the experience"}

        } catch (error) {
            console.error("Error in changeBlockStatus:", error);
            throw error;
        }
    }

    async takeABreak(_id:string,day:string,slot_id:string): Promise<Res> {
        try {
                        
            const scheduleData:ScheduleDoc | null = await this.scheduleRepo.changeAScheduleBreak(_id,day,slot_id,true);
            if(!scheduleData) return {status:false,message:"Cant find the schedule data"}
            return {data:slot_id,status:true,message:"Successfully taken a break"}

        } catch (error) {
            console.error("Error in changeBlockStatus:", error);
            throw error;
        }
    }

    async removeBreak(_id:string,day:string,slot_id:string): Promise<Res> {
        try {
                        
            const scheduleData:ScheduleDoc | null = await this.scheduleRepo.changeAScheduleBreak(_id,day,slot_id,false);
            if(!scheduleData) return {status:false,message:"Cant find the schedule data"}
            return {data:slot_id,status:true,message:"Successfully removed the break"}

        } catch (error) {
            console.error("Error in removeBreak:", error);
            throw error;
        }
    }

    async totalDoctors(filterCondition:FilterCondition): Promise<Res> {
        try {

            const count:Number = await this.doctorRepo.countDocuments(filterCondition);
            return { data: count, status: true, message: "Total Doctors count" };

        } catch (error) {
            console.error("Error in countDocuments:", error);
            throw error;
        }
    }

    async updateSlots(): Promise<void> {
        try {
            const doctors:DoctorDoc[] = await this.doctorRepo.findAllDoctors()
            for(let i=0;i<doctors.length;i++){
                const doctor:DoctorDoc = doctors[i]
                const slots = await generateSlots(doctor.schedule.startTime,doctor.schedule.endTime,doctor.schedule.interval,doctor.workingDays)
                await this.scheduleRepo.updateSchedule(doctor.slots,slots)
            }
        } catch (error) {
            console.error("Error in initializeSlots:", error);
            throw error;
        }
    }

    async verifyEmail(email:string): Promise<Res> {
        try {
            const doctorData:DoctorDoc | null = await this.doctorRepo.findDoctorByEmail(email)
            if(!doctorData) return {status:false,message:"Email not found"}

            const otp:string = await sendVerifyMail(doctorData.firstName + ""+ doctorData.secondName,doctorData.email)
            await this.otpRepo.createOrUpdateOtp(doctorData.email,otp)

            return { data:doctorData , status: true, message: "Otp send" };

            
        } catch (error) {
            console.error("Error in verifyEmail:", error);
            throw error;
        }
    }

    async getOtp(_id:string): Promise<Res> {
        try {

            const doctorData:DoctorDoc | null = await this.doctorRepo.findDoctorById(_id)
            if(!doctorData) return {status:false,message:"Cant find the user"}
            const otpData:OtpDoc | null = await this.otpRepo.findOtpByEmail(doctorData?.email);
            return otpData ? {data:otpData,status:true ,message:"Otp get"} : {status:false ,message:"Can't find the otp"}

        } catch (error) {
            console.error("Error in getOtp:", error);
            throw error;
        }
    }

    async verifyOtp(_id:string,otp:string): Promise<Res> {
        try {

            const doctorData:DoctorDoc | null = await this.doctorRepo.findDoctorById(_id)
            if(!doctorData) throw Error
            const otpData:OtpDoc | null = await this.otpRepo.findOtpByEmail(doctorData.email);
            if(!otpData) throw Error

            if(otpData.otp == otp){
                return { data:doctorData, status: true, message: 'Verification successful' };
            }else{
                return {status:false ,message:"Otp verification filed"}
            }

        } catch (error) {
            console.error("Error in verifyOtp:", error);
            throw error;
        }
    }

    async changePassword(_id:string,password:string): Promise<Res> {
        try {

            const hashedPass: string = await bcrypt.hash(password, 10);

            const doctorData: DoctorDoc | null = await this.doctorRepo.findDoctorById(_id)
            if(!doctorData) return {status:false,message:"Cant find the user"}

            doctorData.password = hashedPass

            const updateDoctor:DoctorDoc | null = await this.doctorRepo.updateDoctor(doctorData,_id)
            if(!updateDoctor) return {status:false,message:"Something wrong please try again later"}
            return { data:updateDoctor , status: true, message: "Password changed successfully" };

        } catch (error) {
            console.error("Error in changePassword:", error);
            throw error;
        }
    }

    async resendOtp(_id:string): Promise<Res> {
        try {

            const doctorData:DoctorDoc | null = await this.doctorRepo.findDoctorById(_id)
            if(!doctorData) return {status:false,message:"Cant find the user"}

            const otp:string = await sendVerifyMail(doctorData.firstName + "" + doctorData.secondName,doctorData.email)
            const otpData:OtpDoc | null = await this.otpRepo.createOrUpdateOtp(doctorData.email,otp);

            return otpData ? {data:otpData,status:true ,message:"Otp sended"} : {status:false ,message:"Can't find the otp"}

        } catch (error) {
            console.error("Error in resendOtp:", error);
            throw error;
        }
    }

}

export default DoctorServices;
