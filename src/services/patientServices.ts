import PatientRepository from "../repositories/patientRepositories";
import { IPatientData, PatientDoc, UpdatePatientData} from '../interfaces/IPatient';
import { Res } from '../interfaces/Icommon';
import { uploadFile } from "../utils/cloudinary";
import { generatePatientId } from "../utils/others";
import { ObjectId } from "mongodb";

class PatientServices {
    private patientRepo: PatientRepository;

    constructor(patientRepo: PatientRepository) {
        this.patientRepo = patientRepo;
    }

    async addPatient(data: IPatientData): Promise<Res> {
        try {

            let patientPublicId:string=""
            if(data.image) patientPublicId = await uploadFile(data.image,"patient_image")
                
            const count:Number  = await this.patientRepo.countDocuments();
            const PatId:string = generatePatientId(count)
            const newData:IPatientData = {...data,image:patientPublicId,id:PatId}

            const patientData:PatientDoc | null = await this.patientRepo.createPatient(newData);
            return { data: patientData, status: true, message: "Patient added successfully" };
        } catch (error) {
            console.error("Error in addPatient:", error);
            throw error;
        }
    }

    async getUserPatients(userId:string): Promise<Res> {
        try {

            const patientsData:PatientDoc[] | [] = await this.patientRepo.findPatientsByUserId(userId);
            return { data: patientsData, status: true, message: "Complete patients list of a specific user" };

        } catch (error) {
            console.error("Error in getUserPatients:", error);
            throw error;
        }
    }

    async getPatients(): Promise<Res> {
        try {

            const patientsData:PatientDoc[] | [] = await this.patientRepo.findPatients();
            return { data: patientsData, status: true, message: "Complete patients list" };

        } catch (error) {
            console.error("Error in findPatients:", error);
            throw error;
        }
    }

    async getPatient(_id:string): Promise<Res> {
        try {

            const patientsData:PatientDoc | null = await this.patientRepo.findPatientById(_id);
            if(!patientsData) return {status:false,message:"Couldn't get the data"}

            return { data: patientsData, status: true, message: "Complete patient Data" };

        } catch (error) {
            console.error("Error in getPatient:", error);
            throw error;
        }
    }

    async updatePatient(_id:string,data:UpdatePatientData): Promise<Res> {
        try {

            let imagePublicId:string
            if(data.image.split("/").includes('Mediheal')){
                imagePublicId=data.image
            }else{
                imagePublicId = await uploadFile(data.image,"doctor_image");
            } 

            const newData:UpdatePatientData = {...data,image:imagePublicId}

            const patientsData:PatientDoc | null = await this.patientRepo.findPatientAndUpdate(_id,newData);
            if(!patientsData) return {status:false,message:"Couldn't get the data"}

            return { data: patientsData, status: true, message: "Complete patient Data" };

        } catch (error) {
            console.error("Error in updatePatient:", error);
            throw error;
        }
    }

    async totalPatients(): Promise<Res> {
        try {

            const count:Number = await this.patientRepo.countDocuments();
            return { data: count, status: true, message: "Total Patients count" };

        } catch (error) {
            console.error("Error in countDocuments:", error);
            throw error;
        }
    }

    async doctorPatients(patientID:ObjectId[]): Promise<Res> {
        try {
        
            const count:PatientDoc[] = await this.patientRepo.findDoctorPatients(patientID);
            return { data: count, status: true, message: "Total Patients count" };

        } catch (error) {
            console.error("Error in findDoctorPatients:", error);
            throw error;
        }
    }

    async totalDoctorPatients(patientID:ObjectId[]): Promise<Res> {
        try {
        
            const count:number = await this.patientRepo.countDoctorPatientsDocs(patientID);
            return { data: count, status: true, message: "Total Doctor Patients Count" };

        } catch (error) {
            console.error("Error in doctorPatientsCount:", error);
            throw error;
        }
    }


}

export default PatientServices;
