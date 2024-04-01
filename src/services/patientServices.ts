import PatientRepository from "../repositories/patientRepositories";
import { IPatientData, PatientDoc} from '../interfaces/IPatient';
import { Res } from '../interfaces/Icommon';
import { uploadFile } from "../utils/cloudinary";

class PatientServices {
    private patientRepo: PatientRepository;

    constructor(patientRepo: PatientRepository) {
        this.patientRepo = patientRepo;
    }

    async addPatient(data: IPatientData): Promise<Res | null> {
        try {

            let patientPublicId:string=""
            if(data.image) patientPublicId = await uploadFile(data.image,"patient_image")
            const newData:IPatientData = {...data,image:patientPublicId}

            const patientData:PatientDoc | null = await this.patientRepo.createPatient(newData);
            return { data: patientData, status: true, message: "Patient added successfully" };
        } catch (error) {
            console.error("Error in addPatient:", error);
            return null;
        }
    }

}

export default PatientServices;
