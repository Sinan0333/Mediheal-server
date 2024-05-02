import AdmitHistoryRepository from "../repositories/admitHistoryRepositories";
import { AdmitHistoryDoc} from '../interfaces/IAdmitHistory';
import { Res } from '../interfaces/Icommon';

class AdmitHistoryServices {
    private admitHistoryRepo: AdmitHistoryRepository

    constructor(admitHistoryRepo: AdmitHistoryRepository) {
        this.admitHistoryRepo = admitHistoryRepo
    }

    async getAdmitHistoryDetails(_id:string ): Promise<Res> {
        try {

            const admitHistoryData:AdmitHistoryDoc | null = await this.admitHistoryRepo.findAdmitHistoryById(_id);
            if(!admitHistoryData) return {status:false,message:"Couldn't get the data"}
            return { data: admitHistoryData, status: true, message: "Bed Details" };

        } catch (error) {
            console.error("Error in getAdmitHistoryDetails:", error);
            throw error;
        }
    }

    async getAllAdmitHistory(): Promise<Res> {
        try {

            const admitHistoryData:AdmitHistoryDoc[] | [] = await this.admitHistoryRepo.findAdmitHistory();
            return { data: admitHistoryData, status: true, message: "All AdmitHIstory Data" };

        } catch (error) {
            console.error("Error in getAllAdmitHistory:", error);
            throw error;
        }
    }
}

export default AdmitHistoryServices;
