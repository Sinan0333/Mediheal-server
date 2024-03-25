import bcrypt from 'bcrypt';
import UserRepositories from "../repositories/userRepositories";
import { UserDoc, UserRes } from '../interfaces/IUser';
import { generateToken } from '../utils/jwt';
import OtpRepositories from '../repositories/otpRepositories';
import { sendVerifyMail } from '../utils/otpVerification';
import { Res } from '../interfaces/Icommon';

class UserServices {
    private userRepo: UserRepositories;
    private otpRepo:OtpRepositories

    constructor(userRepo: UserRepositories ,otpRepo:OtpRepositories) {
        this.userRepo = userRepo;
        this.otpRepo = otpRepo
    }

    async checkExistingEmail(email: string): Promise<boolean> {
        try {
            const userData = await this.userRepo.findUserByEmail(email);
            return !!userData;
        } catch (error) {
            console.error("Error in checkExistingEmail:", error);
            return false;
        }
    }

    async createUser(name: string, phone: string | number, email: string, password: string): Promise<UserRes | null> {
        try {
            // Validate required fields
            if (!name || !phone || !email || !password) {
                return { status: false, message: 'Missing required fields' };
            }

            // Check if email already exists
            const checkEmail: boolean = await this.checkExistingEmail(email);
            if (checkEmail) {
                return { status: false, message: 'Email is already in use' };
            }

            const otp = await sendVerifyMail(name,email)
            await this.otpRepo.createOrUpdateOtp(email,otp)

            // Hash the password
            const hashedPass: string = await bcrypt.hash(password, 10);

            // Convert phone to integer if it's a string
            const phoneNumber: number = typeof phone === "string" ? parseInt(phone) : phone;

            // Create user
            const userData = await this.userRepo.createUser(name, phoneNumber, email, hashedPass);
            return {userData,status: true, message: 'User created successfully' };
        } catch (error) {
            console.error("Error in createUser:", error);
            return null;
        }
    }

    async verifyOtp(_id:string,otp:string): Promise<UserRes | null> {
        try {

            const userData:UserDoc | null = await this.userRepo.findUserById(_id)
            const otpData = await this.otpRepo.findOtpByEmail(userData?.email);

            if(otpData?.otp == otp){
                const userData = await this.userRepo.findUserByIdAndUpdate(_id)
                return { userData, status: true, message: 'Verification successful' };
            }else{
                return {status:false ,message:"Otp verification filed"}
            }

        } catch (error) {
            console.error("Error in authUser:", error);
            return null;
        }
    }

    async getOtp(_id:string): Promise<Res | null> {
        try {

            const userData:UserDoc | null = await this.userRepo.findUserById(_id)
            const otpData = await this.otpRepo.findOtpByEmail(userData?.email);
            return otpData ? {data:otpData.otp,status:true ,message:"Otp get"} : {status:false ,message:"Can't find the otp"}

        } catch (error) {
            console.error("Error in authUser:", error);
            return null;
        }
    }





    async authUser(email: string, password: string): Promise<UserRes | null> {
        try {
            const userData = await this.userRepo.findUserByEmail(email);
            if (userData) {
                const isPasswordValid = await bcrypt.compare(password, userData.password);
                if (isPasswordValid) {
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
}

export default UserServices;
