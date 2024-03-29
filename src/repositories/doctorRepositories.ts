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
            return null;
        }
    }

    async findDoctorByEmail(email: string): Promise<DoctorDoc | null> {
        try {
            const doctorData:DoctorDoc | null = await Doctor.findOne({ email }).populate('department');
            return doctorData;
        } catch (error) {
            console.error("Error finding doctor by email:", error);
            return null;
        }
    }

    async findDoctorById(_id: string): Promise<DoctorDoc | null> {
        try {
            const doctorData:DoctorDoc | null = await Doctor.findOne({ _id }).populate('department');
            return doctorData;
        } catch (error) {
            console.error("Error finding doctor by email:", error);
            return null;
        }
    }

    async findDoctors(): Promise<DoctorDoc[] | null> {
        try {
            const doctorData: DoctorDoc[] = await Doctor.find().populate('department');
            return doctorData;
        } catch (error) {
            console.error("Error finding doctors:", error);
            return null;
        }
    }

    async updateDoctor(data:IDoctorData,_id:string):Promise<DoctorDoc | null>{
        try {
            const doctorData:DoctorDoc | null = await Doctor.findOneAndUpdate({_id},data,{new:true})
            return doctorData
        } catch (error) {
            console.error("Error update doctor:", error);
            return null;
        }
    }

    async changeBlockStatus(_id:string,is_blocked:Boolean):Promise<DoctorDoc | null>{
        try {
            const doctorData:DoctorDoc | null = await Doctor.findOneAndUpdate({_id},{is_blocked:is_blocked},{new:true})
            return doctorData
        } catch (error) {
            console.error("Error changeBlockStatus:", error);
            return null;
        }
    }
}

export default DoctorRepository;
