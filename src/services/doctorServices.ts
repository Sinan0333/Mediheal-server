import bcrypt from 'bcrypt';
import DoctorRepositories from "../repositories/doctorRepositories";
import { DoctorDoc, DoctorRes, IDoctorData } from '../interfaces/IDoctor';
import { Res } from '../interfaces/Icommon';
import { uploadFile } from '../utils/cloudinary';
import { generateToken } from '../utils/jwt';

class DoctorServices {
    private doctorRepo: DoctorRepositories;

    constructor(doctorRepo: DoctorRepositories) {
        this.doctorRepo = doctorRepo;
    }

    async checkExistingEmail(email: string): Promise<boolean> {
        try {
            const userData = await this.doctorRepo.findDoctorByEmail(email);
            return !!userData;
        } catch (error) {
            console.error("Error in checkExistingEmail:", error);
            return false;
        }
    }

    async addDoctor(data: IDoctorData): Promise<Res | null> {
        try {
            const { email, password } = data;

            const checkExist: boolean = await this.checkExistingEmail(email);
            if (checkExist) return { status: false, message: 'User Email already exists' };

            const hashedPass: string = await bcrypt.hash(password, 10);
            const imagePublicId = await uploadFile(data.image, "doctor_image");
            const newData: IDoctorData = { ...data, password: hashedPass,image:imagePublicId };

            const doctorData = await this.doctorRepo.createDoctor(newData);
            return { data: doctorData, status: true, message: 'Doctor registered successfully' };
        } catch (error) {
            console.error("Error in addDoctor:", error);
            return null;
        }
    }

    async authDoctor(email: string, password: string): Promise<DoctorRes | null> {
        try {
            const userData:DoctorDoc | null = await this.doctorRepo.findDoctorByEmail(email);
            if (userData) {
                const isPasswordValid = await bcrypt.compare(password, userData.password);
                if (isPasswordValid && userData._id) {
                    const token: string = generateToken(userData._id);
                    return { userData, token, status: true, message: 'Authentication successful' };
                } else {
                    return { status: false, message: 'Incorrect password' };
                }
            } else {
                return { status: false, message: 'Email not found' };
            }
        } catch (error) {
            console.error("Error in authUser:", error);
            return null;
        }
    }

    async listDoctors():Promise <Res | null>{
        try {

            const doctorsData:IDoctorData[] | null = await this.doctorRepo.findDoctors()
            return {data:doctorsData,status:true, message:"List of doctors"}

        } catch (error) {
            console.error("Error in ListDoctors", error);
            return null;
        }
    }

    async viewDoctor(_id:string):Promise <Res | null>{
        try {

            const doctorsData:IDoctorData | null = await this.doctorRepo.findDoctorById(_id)
            return {data:doctorsData,status:true, message:"Doctor Data"}

        } catch (error) {
            console.error("Error in ListDoctors", error);
            return null;
        }
    }

    async ediDoctor(data: IDoctorData,_id:string): Promise<Res | null> {
        try {
            let imagePublicId

            if(data.image.split("/").includes('Mediheal')){
                imagePublicId=data.image
            }else{
                imagePublicId = await uploadFile(data.image,"doctor_image");
            }

            const newData: IDoctorData = { ...data, image:imagePublicId };

            const doctorData = await this.doctorRepo.updateDoctor(newData,_id);
            return { data: doctorData, status: true, message: 'Doctor updated successfully' };

        } catch (error) {
            console.error("Error in editDoctor:", error);
            return null;
        }
    }

}

export default DoctorServices;
