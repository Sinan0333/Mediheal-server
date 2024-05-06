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

    async totalAdmits(doctor?:string): Promise<Res> {
        try {

            const count:Number = await this.admitHistoryRepo.countDocuments(doctor);
            return { data: count, status: true, message: "Total AdmitHIstory count" };

        } catch (error) {
            console.error("Error in countDocuments:", error);
            throw error;
        }
    }

    async getMonthlyRevenue(percentage:number,doctor?:string): Promise<Res | null> {
        try {

            const currentYear = new Date().getFullYear();
           const admitHistoryData:AdmitHistoryDoc[] | [] = await this.admitHistoryRepo.findAdmitsByYear(currentYear,doctor)           

           const monthlyRevenue = admitHistoryData.reduce((result:any, admits) => {
            const month = admits.dischargeDate.getMonth();            
            const total:number = admits.total || 0
            const revenue:number = total*percentage
            result[month] = (result[month] || 0) + revenue;
            return result;
          }, {});

           return{data:monthlyRevenue,status:true,message:'Monthly  Admits Revenue  get successfully'}

        } catch (error) {
            console.error("Error in v:", error);
            throw error;
        }
    }
}

export default AdmitHistoryServices;
