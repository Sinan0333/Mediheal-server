import { DoctorDoc, IDoctorData } from "../interfaces/IDoctor";
import { FilterCondition } from "../interfaces/Icommon";
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

    async findDoctors(filterCondition:FilterCondition): Promise<DoctorDoc[] | []> {
        try {

            const query:any = {}
            const sort:any = {}
            const skip:number = (filterCondition.page - 1) * 13
            if(filterCondition.filterData && filterCondition.filterData !== "default" && filterCondition.filterData !== "null"){
                query.department = filterCondition.filterData
            }
            if(filterCondition.search && filterCondition.search !== "default" && filterCondition.search !== "null"){
                const regex = new RegExp (`^${filterCondition.search}`, 'i')
                query.firstName = {$regex: regex}
            }
            if(filterCondition.sortBy && filterCondition.sortBy !== "default" && filterCondition.sortBy !== "null" && filterCondition.sortIn && filterCondition.sortIn !== "default" &&filterCondition.sortIn !== "null"){
                sort[filterCondition.sortBy] = parseInt(filterCondition.sortIn)
            }
            
            const doctorData: DoctorDoc[] = await Doctor.find(query).sort(sort).skip(skip).limit(13).populate('department');
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

    async countDocuments(filterCondition:FilterCondition): Promise<Number> {
        try {
            const query:any = {}
            if(filterCondition.filterData && filterCondition.filterData !== "default" && filterCondition.filterData !== "null"){
                query.department = filterCondition.filterData
            }
            if(filterCondition.search && filterCondition.search !== "default" && filterCondition.search !== "null"){
                const regex = new RegExp (`^${filterCondition.search}`, 'i')
                query.firstName = {$regex: regex}
            }

            const count:Number  = await Doctor.countDocuments(query).exec();
            return count;
        } catch (error) {
            console.error("Error in countDocuments:", error);
            throw error;
        }
    }
}

export default DoctorRepository;
