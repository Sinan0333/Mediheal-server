import { AdmitHistoryDoc} from "../interfaces/IAdmitHistory";
import AdmitHistory from "../models/admitHistory";

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
            const admitHistoryData:AdmitHistoryDoc[] | [] = await AdmitHistory.find().populate('assignBy patient').sort({dischargeDate:-1});
            return admitHistoryData;
        } catch (error) {
            console.error("Error in findAdmitHistory:", error);
            throw error;
        }
    }

    async countDocuments(doctor?:string): Promise<Number> {
        try {

            const filter:any = {}
            if(doctor){
                filter.assignBy = doctor
            }

            const count:Number  = await AdmitHistory.countDocuments(filter).exec();
            return count;
        } catch (error) {
            console.error("Error in countDocuments:", error);
            throw error;
        }
    }

    async findAdmitsByYear(year:number,doctor?:string): Promise<AdmitHistoryDoc[] | []> {
        try {

            const filter:any = {
                dischargeDate: {
                    $gte: new Date(`${year}-01-01`),
                    $lt: new Date(`${year + 1}-01-01`)
                  },
            }
            
            if(doctor){
                filter.assignBy = doctor
            }

            const admitHistoryData:AdmitHistoryDoc[] | [] = await AdmitHistory.find(filter)
            return admitHistoryData;
        } catch (error) {
            console.error("Error in findAdmitHistory:", error);
            throw error;
        }
    }
    
}

export default AdmitHistoryRepository;
