import BedRepository from "../repositories/bedRepositories";
import PatientRepository from "../repositories/patientRepositories";
import AdmitHistoryRepository from "../repositories/admitHistoryRepositories";
import { BedDoc, UpdateBedDoc} from '../interfaces/IBed';
import { Res } from '../interfaces/Icommon';
import { PatientDoc } from "../interfaces/IPatient";
import { AdmitHistoryDoc } from "../interfaces/IAdmitHistory";

class BedServices {
    private bedRepo: BedRepository;
    private patientRepo: PatientRepository
    private admitHistoryRepo: AdmitHistoryRepository

    constructor(bedRepo: BedRepository,patientRepo: PatientRepository,admitHistoryRepo: AdmitHistoryRepository) {
        this.bedRepo = bedRepo;
        this.patientRepo = patientRepo
        this.admitHistoryRepo = admitHistoryRepo
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

            const bedData:BedDoc | null = await this.bedRepo.changeBlockStatus(_id,is_blocked)
            return {data:bedData,status:true,message:`Bed is ${is_blocked ? "blocked" : "unblocked"}`}
            
        } catch (error) {
            console.error("Error in ChangeBLockStatus:", error);
            throw error;
        }
    }

    async updateBed(_id:string,data:UpdateBedDoc ): Promise<Res> {
        try {
            
            let patient:string = '';
            if(data.patient){
                const patientData:PatientDoc | null = await this.patientRepo.findPatientByCustomId(""+data.patient)                
                if(!patientData) return {status:false,message:"Wrong patientID"}

                const bedsData:BedDoc[] | null = await this.bedRepo.findBedByPatientId(""+patientData._id)
                const filterBeds:BedDoc[] | undefined = bedsData?.filter((bed)=>bed._id !=_id)
                const checkExist:Boolean | undefined = filterBeds?.every((bed)=>bed.available === true && bed._id != _id)
                if(!checkExist) return {status:false ,message:"This patient is already reserved a bed"}

                patient = patientData._id ? ""+patientData._id : ""
            }

            const date1:Date | undefined= data.assignDate
            const date2:Date | undefined = data.dischargeDate
            if(!date1 || !date2 || !data.charge) return {status:false,message:'Missing required fields'} 

            const parsedDate1 = new Date(date1);
            const parsedDate2 = new Date(date2);

            const differenceInMilliseconds = Math.abs(parsedDate2.getTime() - parsedDate1.getTime());
            const differenceInDays = Math.ceil(differenceInMilliseconds / (1000 * 3600 * 24));
            const total = differenceInDays * data.charge
            
            const newData:UpdateBedDoc = {total,...data}
            newData.patient = patient

            const OldBedData:BedDoc | null = await this.bedRepo.findBedById(_id)
            if(!OldBedData) return {status:false,message:"Couldn't get the data"}
            if(OldBedData?.type != data.type || OldBedData?.charge != data.charge){
                const bedData:BedDoc | null = await this.bedRepo.findOneAndUpdate(newData);
                if(!bedData) return {status:false , message:"No Available Slots Please Select Another Bed Type"}

                await this.bedRepo.findOneAndUnset(_id)
                return { data: bedData, status: true, message: "Bed Updated Successfully" };
            }

            const bedData:BedDoc | null = await this.bedRepo.findBedAndUpdate(_id,newData);
            if(!bedData) return {status:false,message:"Couldn't get the data"}
            return { data: bedData, status: true, message: "Bed Updated Successfully" };

        } catch (error) {
            console.error("Error in updateBed:", error);
            throw error;
        }
    }

    async updateBedTypeAndCharge(_id:string,type:string,charge:number,is_blocked:Boolean): Promise<Res> {
        try {

            const bedData:BedDoc | null = await this.bedRepo.findBedAndUpdate(_id,{type,charge,available:true,is_blocked});
            return {data:bedData,status:true,message:"Bed Updated Successfully"}
            
        } catch (error) {
            console.error("Error in updateBedTypeAndCharge:", error);
            throw error;
        }
    }

    async assignPatient(data:UpdateBedDoc ): Promise<Res | null> {
        try {
            let patient:string = '';
            if(data.patient){
                const patientData:PatientDoc | null = await this.patientRepo.findPatientByCustomId(""+data.patient)                
                if(!patientData) return {status:false,message:"Wrong patientID"}

                const bedsData:BedDoc[] | null = await this.bedRepo.findBedByPatientId(""+patientData._id)
                const checkExist:Boolean | undefined = bedsData?.every((bed)=>bed.available === true)
                if(!checkExist) return {status:false ,message:"This patient is already reserved a bed"}

                patient = patientData._id ? ""+patientData._id : ""
            }

            const date1:Date | undefined= data.assignDate
            const date2:Date | undefined = data.dischargeDate
            if(!date1 || !date2 || !data.charge) return {status:false,message:'Missing required fields'} 

            const parsedDate1 = new Date(date1);
            const parsedDate2 = new Date(date2);

            const differenceInMilliseconds = Math.abs(parsedDate2.getTime() - parsedDate1.getTime());
            const differenceInDays = Math.ceil(differenceInMilliseconds / (1000 * 3600 * 24));
            const total = differenceInDays * data.charge
            
            const newData:UpdateBedDoc = {total,...data}
            newData.patient = patient
            
            const bedData:BedDoc | null = await this.bedRepo.findOneAndUpdate(newData);
            if(!bedData) return {status:false , message:"No Available Slots Please Select Another Bed Type"}
            return { data: bedData, status: true, message: "Patient Assigned to the bed" };

        } catch (error) {
            console.error("Error in assignPatient:", error);
            throw error;
        }
    }

    async createAdmitHistory(data:BedDoc): Promise<Res | null> {
        try {
            
            if(!(data.assignBy && data.assignDate && data.dischargeDate && data.patient && data.description && data._id && data.total) ) return {status:false,message:'Missing required fields'}
            const adminHistory:AdmitHistoryDoc = {
                bedId:data._id,
                assignBy: data.assignBy,
                assignDate: data.assignDate,
                dischargeDate: data.dischargeDate,
                patient: data.patient,
                description: data.description,
                type:data.type,
                charge:data.charge,
                total:data.total
            }

            const adminHistoryData:AdmitHistoryDoc  = await this.admitHistoryRepo.createAdmitHistory(adminHistory)
            return { data: adminHistoryData, status: true, message: "Admit History Created Successfully"}

        } catch (error) {
            console.error("Error in createAdmitHistory:", error);
            throw error;
        }
    }

    async dischargePatient(_id:string): Promise<Res | null> {
        try {
            const bedData:BedDoc | null = await this.bedRepo.findOneAndUnset(_id);
            if(!bedData) return {status:false , message:"Can't Find the Bed"}

            await this.createAdmitHistory(bedData)
            return { data: bedData, status: true, message: "Patient Discharged Successfully"};

        } catch (error) {
            console.error("Error in dischargePatient:", error);
            throw error;
        }
    }

}

export default BedServices;
