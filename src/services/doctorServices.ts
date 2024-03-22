import bcrypt from 'bcrypt';
import DoctorRepositories from "../repositories/doctorRepositories";
import { IDoctorData } from '../interfaces/IDoctor';
import { Res } from '../interfaces/Icommen';

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
            const newData: IDoctorData = { ...data, password: hashedPass };

            const doctorData = await this.doctorRepo.createDoctor(newData);
            return { data: doctorData, status: true, message: 'Doctor registered successfully' };
        } catch (error) {
            console.error("Error in addDoctor:", error);
            return null;
        }
    }
}

export default DoctorServices;
