import { AdmitHistoryDoc} from "../interfaces/IAdmitHistory";
import { FilterCondition } from "../interfaces/Icommon";
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

    async findAdmitHistory(filterCondition:FilterCondition): Promise<AdmitHistoryDoc[] | []> {
        try {

            const query:any = {}
            const sort:any = {}
            const skip:number = (filterCondition.page - 1) * 13
            if(filterCondition.charge &&filterCondition.charge !== "default" && filterCondition.charge !== "null"){
                query.charge = parseInt(filterCondition.charge)
            }
            if(filterCondition.filterData && filterCondition.filterData !== "default" && filterCondition.filterData !== "null"){
                query.type = filterCondition.filterData
            }
            if(filterCondition.sortBy && filterCondition.sortBy !== "default" && filterCondition.sortBy !== "null" && filterCondition.sortIn && filterCondition.sortIn !== "default" &&filterCondition.sortIn !== "null"){
                sort[filterCondition.sortBy] = parseInt(filterCondition.sortIn)
            }else{
                sort.dischargeDate = -1
            }

            const admitHistoryData:AdmitHistoryDoc[] | [] = await AdmitHistory.find(query).populate('assignBy patient').sort(sort).skip(skip).limit(13).exec();
            return admitHistoryData;
        } catch (error) {
            console.error("Error in findAdmitHistory:", error);
            throw error;
        }
    }

    async countDocuments(filterCondition:FilterCondition,doctor?:string): Promise<Number> {
        try {
            
            const query:any = {}
            if(filterCondition.charge && filterCondition.charge !== "default" && filterCondition.charge !== "null"){
                query.charge = parseInt(filterCondition.charge)
            }
            if(filterCondition.filterData &&filterCondition.filterData !== "default" && filterCondition.filterData !== "null"){
                query.type = filterCondition.filterData
            }
            if(doctor){
                query.assignBy = doctor
            }

            const count:Number  = await AdmitHistory.countDocuments(query).exec();
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
