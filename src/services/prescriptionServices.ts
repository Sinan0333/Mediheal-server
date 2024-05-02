import PrescriptionRepository from "../repositories/prescriptionRepositories";
import { IPrescriptionData, PrescriptionDoc} from '../interfaces/IPrescription';
import { Res } from '../interfaces/Icommon';

class PrescriptionServices {
    private prescriptionRepo: PrescriptionRepository;

    constructor(prescriptionRepo: PrescriptionRepository) {
        this.prescriptionRepo = prescriptionRepo;

    }

    async getPrescriptionData(_id:string): Promise<Res | null> {
        try {

           const prescriptionData:PrescriptionDoc | null = await this.prescriptionRepo.findPrescriptionById(_id)
           if(!prescriptionData) return {status:false,message:"Couldn't get the data"}
            return{data:prescriptionData,status:true,message:'Prescription Data get successfully'}

        } catch (error) {
            console.error("Error in getPrescriptionData:", error);
            throw error;
        }
    }

    async createPrescription(data: IPrescriptionData): Promise<Res> {
        try {

            const patientData:PrescriptionDoc | null = await this.prescriptionRepo.createPrescription(data);
            return { data: patientData, status: true, message: "Prescription added successfully" };

        } catch (error) {
            console.error("Error in createPrescription:", error);
            throw error;
        }
    }

    async getPatientPrescriptions(_id:string): Promise<Res | null> {
        try {

           const prescriptionData:PrescriptionDoc[] | [] = await this.prescriptionRepo.findPrescriptionsByPatientId(_id)
           if(!prescriptionData) return {status:false,message:"Couldn't get the data"}
            return{data:prescriptionData,status:true,message:'Prescription Data get successfully'}

        } catch (error) {
            console.error("Error in getPatientPrescriptions:", error);
            throw error;
        }
    }

}

export default PrescriptionServices;
