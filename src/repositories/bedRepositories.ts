import { BedDoc} from "../interfaces/IBed";
import Bed from "../models/bedModel";

class BedRepository {

    async findBedById(_id:string): Promise<BedDoc | null> {
        try {
            const bedData:BedDoc | null = await Bed.findOne({ _id }).exec();
            return bedData;
        } catch (error) {
            console.error("Error in findBedById:", error);
            return null;
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

    async findBeds(): Promise<BedDoc[] | null> {
        try {
            const bedData:BedDoc[] | null = await Bed.find().exec();
            return bedData;
        } catch (error) {
            console.error("Error in findBedById:", error);
            return null;
        }
    }

    async changeBlockStatus(_id:string,is_blocked:Boolean):Promise<BedDoc | null>{
        try {
            const bedData:BedDoc | null = await Bed.findOneAndUpdate({_id},{is_blocked:is_blocked},{new:true})
            return bedData
        } catch (error) {
            console.error("Error changeBlockStatus:", error);
            return null;
        }
    }
    
    
}

export default BedRepository;
