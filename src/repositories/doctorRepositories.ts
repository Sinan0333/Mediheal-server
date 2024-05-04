import { DoctorDoc, IDoctorData } from "../interfaces/IDoctor";
import Doctor from "../models/doctorModel";

class DoctorRepository {

    async createDoctor(data: IDoctorData): Promise<DoctorDoc | null> {
        try {
            const doctorModel = new Doctor(data);
            const savedDoctor:DoctorDoc = await doctorModel.save();
            return savedDoctor;
        } catch (error) {
            console.error("Error creating doctor:", error);
            throw error;
        }
    }

    async findDoctorByEmail(email: string): Promise<DoctorDoc | null> {
        try {
            const doctorData:DoctorDoc | null = await Doctor.findOne({ email }).populate('department');
            return doctorData;
        } catch (error) {
            console.error("Error finding doctor by email:", error);
            throw error;
        }
    }

    async findDoctorById(_id: string): Promise<DoctorDoc | null> {
        try {
            const doctorData:DoctorDoc | null = await Doctor.findOne({ _id }).populate('department slots').exec();
            return doctorData;
        } catch (error) {
            console.error("Error finding doctor by email:", error);
            throw error;
        }
    }

    async findDoctors(): Promise<DoctorDoc[] | []> {
        try {
            const doctorData: DoctorDoc[] = await Doctor.find().populate('department');
            return doctorData;
        } catch (error) {
            console.error("Error finding doctors:", error);
            throw error;
        }
    }

    async updateDoctor(data:IDoctorData,_id:string):Promise<DoctorDoc | null>{
        try {
            const doctorData:DoctorDoc | null = await Doctor.findOneAndUpdate({_id},data,{new:true})
            return doctorData
        } catch (error) {
            console.error("Error update doctor:", error);
            throw error;
        }
    }

    async changeBlockStatus(_id:string,is_blocked:Boolean):Promise<DoctorDoc | null>{
        try {
            const doctorData:DoctorDoc | null = await Doctor.findOneAndUpdate({_id},{is_blocked:is_blocked},{new:true})
            return doctorData
        } catch (error) {
            console.error("Error changeBlockStatus:", error);
            throw error;
        }
    }

    async countDocuments(): Promise<Number> {
        try {
            const count:Number  = await Doctor.countDocuments().exec();
            return count;
        } catch (error) {
            console.error("Error in countDocuments:", error);
            throw error;
        }
    }
}

export default DoctorRepository;
