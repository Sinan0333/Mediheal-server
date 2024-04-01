import { IPatientData, PatientDoc } from "../interfaces/IPatient";
import Patient from "../models/patientModel";

class PatientRepository {

    async findPatientByUserId(userId:string): Promise<PatientDoc | null> {
        try {
            const patientData:PatientDoc | null = await Patient.findOne({ userId }).exec();
            return patientData;
        } catch (error) {
            console.error("Error in findPatientByUserId:", error);
            return null;
        }
    }

    async createPatient(data:IPatientData): Promise<PatientDoc  | null> {
        try {
            const patientModel = new Patient(data);
            return await patientModel.save();
        } catch (error) {
            console.error("Error in createOrUpdateOtp:", error);
            throw error;
        }
    }
    
}

export default PatientRepository;
