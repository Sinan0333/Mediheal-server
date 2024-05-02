import { IPrescriptionData, PrescriptionDoc } from "../interfaces/IPrescription";
import Prescription from "../models/prescriptionModel";

class PrescriptionRepository {

    async findPrescriptionById(_id:string): Promise<PrescriptionDoc | null> {
        try {
            const appointmentData:PrescriptionDoc | null = await Prescription.findOne({ _id}).populate('patient appointment')
            return appointmentData;
        } catch (error) {
            console.error("Error in findPrescriptionById:", error);
            throw error;
        }
    }

    async createPrescription(data:IPrescriptionData): Promise<PrescriptionDoc> {
        try {
            const prescriptionModel = new Prescription(data);
            const savedPrescription:PrescriptionDoc = await prescriptionModel.save();
            return savedPrescription;
        } catch (error) {
            console.error("Error in createPrescription:", error);
            throw error;
        }
    }

    async findPrescriptionsByPatientId(patient:string): Promise<PrescriptionDoc[]> {
        try {
            const appointmentData:PrescriptionDoc[] | [] = await Prescription.find({ patient}).populate('patient appointment doctor')
            return appointmentData;
        } catch (error) {
            console.error("Error in findPrescriptionsByPatientId:", error);
            throw error;
        }
    }
    
}

export default PrescriptionRepository;
