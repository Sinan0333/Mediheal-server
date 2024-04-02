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
    
}

export default BedRepository;
