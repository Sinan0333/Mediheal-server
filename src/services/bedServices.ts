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

    async addBed(data: BedDoc): Promise<Res> {
        try {

            const patientData:BedDoc| null = await this.bedRepo.createBed(data);
            return { data: patientData, status: true, message: "Bed added successfully" };
        } catch (error) {
            console.error("Error in addBed:", error);
            throw error;
        }
    }

    async getBedDetails(_id:string ): Promise<Res> {
        try {

            const bedData:BedDoc | null = await this.bedRepo.findBedById(_id);
            if(!bedData) return {status:false,message:"Couldn't get the data"}
            return { data: bedData, status: true, message: "Bed Details" };

        } catch (error) {
            console.error("Error in getBedDetails:", error);
            throw error;
        }
    }

    async getAllBeds(): Promise<Res> {
        try {

            const bedData:BedDoc[] | [] = await this.bedRepo.findBeds();
            return { data: bedData, status: true, message: "All Bed Data" };

        } catch (error) {
            console.error("Error in getAllBeds:", error);
            throw error;
        }
    }

    async changeBlockStatus(_id:string,is_blocked:Boolean): Promise<Res> {
        try {

            const doctorData:BedDoc | null = await this.bedRepo.changeBlockStatus(_id,is_blocked)
            return {data:doctorData,status:true,message:`Bed is ${is_blocked ? "blocked" : "unblocked"}`}
            
        } catch (error) {
            console.error("Error in ChangeBLockStatus:", error);
            throw error;
        }
    }

    async updateBed(_id:string,data:UpdateBedDoc ): Promise<Res> {
        try {
            
            if(data.patient){
                const patientData:PatientDoc | null = await this.patientRepo.findPatientById(""+data.patient)                
                if(!patientData) return {status:false,message:"Wrong patientID"}

                const bedsData:BedDoc[] | null = await this.bedRepo.findBedByPatientId(""+data.patient)
                const filterBeds:BedDoc[] | undefined = bedsData?.filter((bed)=>bed._id !=_id)
                const checkExist:Boolean | undefined = filterBeds?.every((bed)=>bed.available === true && bed._id != _id)
                if(!checkExist) return {status:false ,message:"This patient is already reserved a bed"}
            }

            const OldBedData:BedDoc | null = await this.bedRepo.findBedById(_id)
            if(!OldBedData) return {status:false,message:"Couldn't get the data"}
            if(OldBedData?.type != data.type || OldBedData?.charge != data.charge){
                const bedData:BedDoc | null = await this.bedRepo.findOneAndUpdate(data);
                if(!bedData) return {status:false , message:"No Available Slots Please Select Another Bed Type"}

                await this.bedRepo.findOneAndUnset(_id)
                return { data: bedData, status: true, message: "Bed Updated Successfully" };
            }

            const bedData:BedDoc | null = await this.bedRepo.findBedAndUpdate(_id,data);
            if(!bedData) return {status:false,message:"Couldn't get the data"}
            return { data: bedData, status: true, message: "Bed Updated Successfully" };

        } catch (error) {
            console.error("Error in updateBed:", error);
            throw error;
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
            throw error;
        }
    }

    async dischargePatient(_id:string): Promise<Res | null> {
        try {
            const bedData:BedDoc | null = await this.bedRepo.findOneAndUnset(_id);
            return { data: bedData, status: true, message: "Patient Discharged Successfully"};

        } catch (error) {
            console.error("Error in dischargePatient:", error);
            throw error;
        }
    }

}

export default BedServices;
