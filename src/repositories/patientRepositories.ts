import { ObjectId } from "mongodb";
import { IPatientData, PatientDoc, UpdatePatientData } from "../interfaces/IPatient";
import Patient from "../models/patientModel";
import { FilterCondition } from "../interfaces/Icommon";

class PatientRepository {

    async findPatientsByUserId(userId:string): Promise<PatientDoc[] | []> {
        try {
            const patientData:PatientDoc[] | null = await Patient.find({ userId }).exec();
            return patientData;
        } catch (error) {
            console.error("Error in findPatientsByUserId:", error);
            throw error;
        }
    }

    async createPatient(data:IPatientData): Promise<PatientDoc  | null> {
        try {
            const patientModel = new Patient(data);
            return await patientModel.save();
        } catch (error) {
            console.error("Error in createPatient:", error);
            throw error;
        }
    }

    async findPatientById(_id:string): Promise<PatientDoc  | null> {
        try {
            const patientData:PatientDoc | null = await Patient.findOne({ _id }).exec();
            return patientData;
        } catch (error) {
            console.error("Error in findPatientById:", error);
            throw error;
        }
    }

    async findPatientByCustomId(id:string): Promise<PatientDoc  | null> {
        try {
            const patientData:PatientDoc | null = await Patient.findOne({ id }).exec();
            return patientData;
        } catch (error) {
            console.error("Error in findPatientByCustomId:", error);
            throw error;
        }
    }

    async findPatients(filterCondition:FilterCondition): Promise<PatientDoc[]  | []> {
        try {

            const query:any = {}
            const sort:any = {}
            const skip:number = (filterCondition.page - 1) * 13
            if(filterCondition.filterData && filterCondition.filterData !== "default" && filterCondition.filterData !== "null"){
                query.bloodGroup = filterCondition.filterData
            }
            if(filterCondition.search && filterCondition.search !== "default" && filterCondition.search !== "null"){
                const regex = new RegExp (`^${filterCondition.search}`, 'i')
                query.id = {$regex: regex}
            }
            if(filterCondition.sortBy && filterCondition.sortBy !== "default" && filterCondition.sortBy !== "null" && filterCondition.sortIn && filterCondition.sortIn !== "default" &&filterCondition.sortIn !== "null"){
                sort[filterCondition.sortBy] = parseInt(filterCondition.sortIn)
            }

            const patientData:PatientDoc[] | null = await Patient.find(query).sort(sort).skip(skip).limit(13).exec();
            return patientData;
        } catch (error) {
            console.error("Error in findPatients:", error);
            throw error;
        }
    }

    async findDoctorPatients(patientID:ObjectId[],filterCondition:FilterCondition): Promise<PatientDoc[] | []> {
        try {

            const query:any = {}
            const sort:any = {}
            const skip:number = (filterCondition.page - 1) * 13
            query._id = { $in: patientID }
            if(filterCondition.filterData && filterCondition.filterData !== "default" && filterCondition.filterData !== "null"){
                query.bloodGroup = filterCondition.filterData
            }
            if(filterCondition.search && filterCondition.search !== "default" && filterCondition.search !== "null"){
                const regex = new RegExp (`^${filterCondition.search}`, 'i')
                query.id = {$regex: regex}
            }
            if(filterCondition.sortBy && filterCondition.sortBy !== "default" && filterCondition.sortBy !== "null" && filterCondition.sortIn && filterCondition.sortIn !== "default" &&filterCondition.sortIn !== "null"){
                sort[filterCondition.sortBy] = parseInt(filterCondition.sortIn)
            }
            const patientData: PatientDoc[] | null = await Patient.find(query).sort(sort).skip(skip).limit(13).exec();
    
            return patientData;
        } catch (error) {
            console.error("Error in findDoctorPatients:", error);
            throw error;
        }
    }

    async countDocuments(filterCondition?:FilterCondition): Promise<Number> {
        try {

            
            const query:any = {}
            if(filterCondition && filterCondition.filterData && filterCondition.filterData !== "default" && filterCondition.filterData !== "null"){
                query.bloodGroup = filterCondition.filterData
            }
            if(filterCondition && filterCondition.search && filterCondition.search !== "default" && filterCondition.search !== "null"){
                const regex = new RegExp (`^${filterCondition.search}`, 'i')
                query.id = {$regex: regex}
            }

            const count:Number  = await Patient.countDocuments(query).exec();
            return count;
        } catch (error) {
            console.error("Error in countDocuments:", error);
            throw error;
        }
    }

    async countDoctorPatientsDocs(patientID:ObjectId[],filterCondition:FilterCondition): Promise<number> {
        try {

            const query:any = {}
            query._id = { $in: patientID }
            if(filterCondition.filterData &&filterCondition.filterData !== "default" && filterCondition.filterData !== "null"){
                query.bloodGroup = filterCondition.filterData
            }
            if(filterCondition.search && filterCondition.search !== "default" && filterCondition.search !== "null"){
                const regex = new RegExp (`^${filterCondition.search}`, 'i')
                query.id = {$regex: regex}
            }
console.log(query);

            const count:number  = await Patient.countDocuments(query).exec();
            return count;
        } catch (error) {
            console.error("Error in countDocuments:", error);
            throw error;
        }
    }

    async findPatientAndUpdate(_id:string,data:UpdatePatientData): Promise<PatientDoc  | null> {
        try {
            const patientData:PatientDoc | null = await Patient.findOneAndUpdate({_id},data,{new:true}).exec();
            return patientData;
        } catch (error) {
            console.error("Error in findPatientAndUpdate:", error);
            throw error;
        }
    }
    
}

export default PatientRepository;
