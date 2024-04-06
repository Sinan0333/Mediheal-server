import { IPatientData, PatientDoc } from "../interfaces/IPatient";
import Patient from "../models/patientModel";

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
    
}

export default PatientRepository;
