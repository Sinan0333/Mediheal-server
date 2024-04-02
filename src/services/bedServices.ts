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

}

export default BedServices;
