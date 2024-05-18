import bcrypt from 'bcrypt';
import DoctorRepositories from "../repositories/doctorRepositories";
import ScheduleRepository from '../repositories/scheduleRepository';
import { DoctorDoc, DoctorRes, IDoctorData } from '../interfaces/IDoctor';
import { FilterCondition, Res } from '../interfaces/Icommon';
import { uploadFile } from '../utils/cloudinary';
import { generateRefreshToken, generateToken, verifyToken } from '../utils/jwt';
import { generateSlots, generateSlotsForADay } from '../utils/schedule';
import { ScheduleDoc } from '../interfaces/Ischedule';
import { removeDays } from '../utils/others';

class DoctorServices {
    private doctorRepo: DoctorRepositories;
    private scheduleRepo:ScheduleRepository

    constructor(doctorRepo: DoctorRepositories,scheduleRepo:ScheduleRepository) {
        this.doctorRepo = doctorRepo;
        this.scheduleRepo = scheduleRepo
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
                if (isPasswordValid && userData._id) {
                    const token: string = generateToken(userData);
                    const refreshToken:string = generateRefreshToken(userData)
                    return { userData, token,refreshToken, status: true, message: 'Authentication successful' };
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

}

export default DoctorServices;
