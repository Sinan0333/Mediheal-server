import BedRepository from "../repositories/bedRepositories";
import PatientRepository from "../repositories/patientRepositories";
import { BedDoc, UpdateBedDoc} from '../interfaces/IBed';
import { Res } from '../interfaces/Icommon';
import { PatientDoc } from "../interfaces/IPatient";

class BedServices {
    private bedRepo: BedRepository;
    private patientRepo: PatientRepository

    constructor(bedRepo: BedRepository,patientRepo: PatientRepository) {
        this.bedRepo = bedRepo;
        this.patientRepo = patientRepo
    }

    async addBed(data: BedDoc): Promise<Res | null> {
        try {

            const patientData:BedDoc| null = await this.bedRepo.createBed(data);
            return { data: patientData, status: true, message: "Bed added successfully" };
        } catch (error) {
            console.error("Error in addBed:", error);
            return null;
        }
    }

    async getBedDetails(_id:string ): Promise<Res | null> {
        try {

            const bedData:BedDoc | null = await this.bedRepo.findBedById(_id);
            return { data: bedData, status: true, message: "Bed Details" };

        } catch (error) {
            console.error("Error in getBedDetails:", error);
            return null;
        }
    }

    async getAllBeds(): Promise<Res | null> {
        try {

            const bedData:BedDoc[] | null = await this.bedRepo.findBeds();
            return { data: bedData, status: true, message: "All Bed Data" };

        } catch (error) {
            console.error("Error in getAllBeds:", error);
            return null;
        }
    }

    async changeBlockStatus(_id:string,is_blocked:Boolean): Promise<Res | null> {
        try {

            const doctorData:BedDoc | null = await this.bedRepo.changeBlockStatus(_id,is_blocked)
            return {data:doctorData,status:true,message:`Bed is ${is_blocked ? "blocked" : "unblocked"}`}
            
        } catch (error) {
            console.error("Error in ChangeBLockStatus:", error);
            return null;
        }
    }

    
    async updateBed(_id:string,data:UpdateBedDoc ): Promise<Res | null> {
        try {

            const bedData:BedDoc | null = await this.bedRepo.findBedAndUpdate(_id,data);
            return { data: bedData, status: true, message: "updateBed" };

        } catch (error) {
            console.error("Error in getBedDetails:", error);
            return null;
        }
    }

    async assignPatient(data:UpdateBedDoc ): Promise<Res | null> {
        try {
            if(data.patient){
                const patientData:PatientDoc | null = await this.patientRepo.findPatientById(""+data.patient)                
                if(!patientData) return {status:false,message:"Wrong patientID"}

                const bedsData:BedDoc[] | null = await this.bedRepo.findBedByPatientId(""+data.patient)
                const checkExist:Boolean | undefined = bedsData?.every((bed)=>bed.available === true)
                if(!checkExist) return {status:false ,message:"This patient is already reserved a bed"}
            }

            const bedData:BedDoc | null = await this.bedRepo.findOneAndUpdate(data);
            if(!bedData) return {status:false , message:"No Available Slots Please Select Another Bed Type"}
            return { data: bedData, status: true, message: "Patient Assigned to the bed" };

        } catch (error) {
            console.error("Error in assignPatient:", error);
            return null;
        }
    }

}

export default BedServices;
