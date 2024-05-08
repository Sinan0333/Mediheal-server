import { BedDoc, UpdateBedDoc} from "../interfaces/IBed";
import { FilterCondition } from "../interfaces/Icommon";
import Bed from "../models/bedModel";

class BedRepository {

    async findBedById(_id:string): Promise<BedDoc | null> {
        try {
            const bedData:BedDoc | null = await Bed.findOne({ _id }).populate('assignBy patient');
            return bedData;
        } catch (error) {
            console.error("Error in findBedById:", error);
            throw error;
        }
    }

    async createBed(data:BedDoc): Promise<BedDoc  | null> {
        try {
            const patientModel = new Bed(data);
            return await patientModel.save();
        } catch (error) {
            console.error("Error in createBed:", error);
            throw error;
        }
    }

    async findBeds(filterCondition:FilterCondition): Promise<BedDoc[] | []> {
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
            }
                      
            const bedData:BedDoc[] | [] = await Bed.find(query).sort(sort).skip(skip).limit(13).populate('assignBy patient')
            return bedData;
        } catch (error) {
            console.error("Error in findBeds:", error);
            throw error;
        }
    }

    async findBedAndUpdate(_id:string,data:UpdateBedDoc): Promise<BedDoc | null> {
        try {
            const bedData:BedDoc | null = await Bed.findOneAndUpdate({_id},data,{new:true}).exec();
            return bedData;
        } catch (error) {
            console.error("Error in findBedAndUpdate:", error);
            throw error;
        }
    }

    async findOneAndUpdate(data:UpdateBedDoc): Promise<BedDoc | null> {
        try {
            const bedData:BedDoc | null = await Bed.findOneAndUpdate({available:true,is_blocked:false,type:data.type,charge:data.charge},data,{new:true}).exec();
            return bedData;
        } catch (error) {
            console.error("Error in findOneAndUpdate:", error);
            throw error;
        }
    }

    async changeBlockStatus(_id:string,is_blocked:Boolean):Promise<BedDoc | null>{
        try {
            const bedData:BedDoc | null = await Bed.findOneAndUpdate({_id},{is_blocked:is_blocked},{new:true})
            return bedData
        } catch (error) {
            console.error("Error changeBlockStatus:", error);
            throw error;
        }
    }

    async findBedByPatientId(patient:string):Promise<BedDoc[] | []>{
        try {
            const bedData:BedDoc[] | null = await Bed.find({patient})
            return bedData
        } catch (error) {
            console.error("Error findBedByPatientId:", error);
            throw error;
        }
    }
    
    async findOneAndUnset(_id:string):Promise<BedDoc | null>{
        try {
            const bedData:BedDoc | null = await Bed.findOneAndUpdate({_id},{$set:{available:true}, $unset: { patient: "",assignBy:"",assignDate:"",dischargeDate:"",description:"",total:"", }},{new:false})
            return bedData
        } catch (error) {
            console.error("Error findOneAndUnset:", error);
            throw error;
        }
    }

    async countDocuments(filterCondition:FilterCondition): Promise<Number> {
        try {
            const query:any = {}
            if(filterCondition.charge && filterCondition.charge !== "default" && filterCondition.charge !== "null"){
                query.charge = parseInt(filterCondition.charge)
            }
            if(filterCondition.filterData &&filterCondition.filterData !== "default" && filterCondition.filterData !== "null"){
                query.type = filterCondition.filterData
            }

            const count:Number  = await Bed.countDocuments(query).exec();
            return count;
        } catch (error) {
            console.error("Error in countDocuments:", error);
            throw error;
        }
    }

    async vacantBedsCountDocuments(): Promise<Number> {
        try {
            const count: number = await Bed.countDocuments({ available:true,is_blocked:false }).exec();
            return count;
        } catch (error) {
            console.error("Error in vacantBedsCountDocuments:", error);
            throw error;
        }
    }
    
}

export default BedRepository;
