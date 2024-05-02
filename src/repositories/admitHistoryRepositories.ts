import { AdmitHistoryDoc} from "../interfaces/IAdmitHistory";
import AdmitHistory from "../models/AdmitHistory";

class AdmitHistoryRepository {

    async findAdmitHistoryById(_id:string): Promise<AdmitHistoryDoc | null> {
        try {
            const AdmitHistoryData:AdmitHistoryDoc | null = await AdmitHistory.findOne({ _id }).populate('assignBy patient');
            return AdmitHistoryData;
        } catch (error) {
            console.error("Error in findAdmitHistoryById:", error);
            throw error;
        }
    }

    async createAdmitHistory(data:AdmitHistoryDoc): Promise<AdmitHistoryDoc> {
        try {
            const AdmitHistoryModel = new AdmitHistory(data);
            return await AdmitHistoryModel.save();
        } catch (error) {
            console.error("Error in createAdmitHistory:", error);
            throw error;
        }
    }

    async findAdmitHistory(): Promise<AdmitHistoryDoc[] | []> {
        try {
            const admitHistoryData:AdmitHistoryDoc[] | [] = await AdmitHistory.find().populate('assignBy patient');
            return admitHistoryData;
        } catch (error) {
            console.error("Error in findAdmitHistory:", error);
            throw error;
        }
    }
    
}

export default AdmitHistoryRepository;
