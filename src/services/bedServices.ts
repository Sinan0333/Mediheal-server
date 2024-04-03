import BedRepository from "../repositories/bedRepositories";
import { BedDoc} from '../interfaces/IBed';
import { Res } from '../interfaces/Icommon';

class BedServices {
    private bedRepo: BedRepository;

    constructor(bedRepo: BedRepository) {
        this.bedRepo = bedRepo;
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

    async getBedDetails(_id:string  ): Promise<Res | null> {
        try {

            const bedData:BedDoc | null = await this.bedRepo.findBedById(_id);
            return { data: bedData, status: true, message: "Bed Details" };

        } catch (error) {
            console.error("Error in addPatient:", error);
            return null;
        }
    }

    async getAllBeds(): Promise<Res | null> {
        try {

            const bedData:BedDoc[] | null = await this.bedRepo.findBeds();
            return { data: bedData, status: true, message: "All Bed Datas" };

        } catch (error) {
            console.error("Error in addPatient:", error);
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

}

export default BedServices;
