import { BedDoc, UpdateBedDoc} from "../interfaces/IBed";
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

    async findBeds(): Promise<BedDoc[] | []> {
        try {
            const bedData:BedDoc[] | [] = await Bed.find().populate('assignBy patient');
            return bedData;
        } catch (error) {
            console.error("Error in findBedById:", error);
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
            const bedData:BedDoc | null = await Bed.findOneAndUpdate({_id},{$set:{available:true}, $unset: { patient: "",assignBy:"",assignDate:"",dischargeDate:"",description:"",total:"", } })
            return bedData
        } catch (error) {
            console.error("Error findOneAndUnset:", error);
            throw error;
        }
    }
    
}

export default BedRepository;
