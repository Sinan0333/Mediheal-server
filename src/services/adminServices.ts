import bcrypt from 'bcrypt';
import AdminRepository from "../repositories/adminRepositories";
import OtpRepository from '../repositories/otpRepositories';
import { UserDoc, UserRes } from '../interfaces/IUser';
import { generateRefreshToken, generateToken, verifyToken } from '../utils/jwt';
import { Res } from '../interfaces/Icommon';
import { sendVerifyMail } from '../utils/otpVerification';
import { OtpDoc } from '../interfaces/IOtp';

class AdminServices {
    private adminRepo: AdminRepository;
    private otpRepo: OtpRepository

    constructor(adminRepo: AdminRepository, otpRepo: OtpRepository) {
        this.adminRepo = adminRepo;
        this.otpRepo = otpRepo
    }

    async authAdmin(email: string, password: string): Promise<UserRes > {
        try {
            const userData: UserDoc | null = await this.adminRepo.findAdminByEmail(email);

            if (userData) {
                const isPasswordValid:Boolean = await bcrypt.compare(password, userData.password);

                if (isPasswordValid) {
                    const token: string = generateToken(userData);
                    const refreshToken:string = generateRefreshToken(userData)
                    return { userData, token,refreshToken, status: true, message: 'Authentication successful' };
                } else {
                    return { status: false, message: 'Incorrect password' };
                }
            } else {
                return { status: false, message: 'Email not found' };
            }
        } catch (error) {
            console.error("Error in authAdmin:", error);
            throw error;
        }
    }

    async refreshToken(token:string): Promise<Res> {
        try {

           const decodedToken = verifyToken(token);
           const userData:UserDoc | null = await this.adminRepo.findAdminByEmail(decodedToken.email)

           if(!userData) return {status:false,message:"Cant find the user"}
           const accessToken:string = generateToken(userData)
           const refreshToken:string = generateRefreshToken(userData)

            return {status:true ,data:{accessToken,refreshToken} ,message:"Token refreshed"}

        } catch (error) {
            console.error("Error in refreshToken:", error);
            throw error;
        }
    }

    async adminProfile(_id:string): Promise<Res> {
        try {
        
           const userData:UserDoc | null = await this.adminRepo.findAdminById(_id)
           if(!userData) return {status:false,message:"Cant find the user"}
            return {status:true ,data:userData ,message:"Token refreshed"}

        } catch (error) {
            console.error("Error in adminProfile:", error);
            throw error;
        }
    }

    async verifyEmail(email:string): Promise<Res> {
        try {

            const userData:UserDoc | null = await this.adminRepo.findAdminByEmail(email)
            if(!userData) return {status:false,message:"Email not found"}

            const otp:string = await sendVerifyMail(userData.name,userData.email)
            await this.otpRepo.createOrUpdateOtp(userData.email,otp)

            return { data:userData , status: true, message: "Otp send" };

        } catch (error) {
            console.error("Error in verifyEmail:", error);
            throw error;
        }
    }

    async getOtp(_id:string): Promise<Res> {
        try {

            const userData:UserDoc | null = await this.adminRepo.findAdminById(_id)
            if(!userData) return {status:false,message:"Cant find the user"}
            const otpData:OtpDoc | null = await this.otpRepo.findOtpByEmail(userData?.email);
            return otpData ? {data:otpData,status:true ,message:"Otp get"} : {status:false ,message:"Can't find the otp"}

        } catch (error) {
            console.error("Error in getOtp:", error);
            throw error;
        }
    }

    async verifyOtp(_id:string,otp:string): Promise<Res> {
        try {

            const userData:UserDoc | null = await this.adminRepo.findAdminById(_id)
            if(!userData) throw Error
            const otpData:OtpDoc | null = await this.otpRepo.findOtpByEmail(userData.email);
            if(!otpData) throw Error

            if(otpData.otp == otp){
                return { data:userData, status: true, message: 'Verification successful' };
            }else{
                return {status:false ,message:"Otp verification filed"}
            }

        } catch (error) {
            console.error("Error in verifyOtp:", error);
            throw error;
        }
    }

    async changePassword(_id:string,password:string): Promise<Res> {
        try {

            const hashedPass: string = await bcrypt.hash(password, 10);

            const userData: UserDoc | null = await this.adminRepo.findAdminById(_id)
            if(!userData) return {status:false,message:"Cant find the user"}

            userData.password = hashedPass

            const updateUser:UserDoc | null = await this.adminRepo.findAdminAndUpdate(_id,userData)
            if(!updateUser) return {status:false,message:"Something wrong please try again later"}
            return { data:updateUser , status: true, message: "Password changed successfully" };

        } catch (error) {
            console.error("Error in changePassword:", error);
            throw error;
        }
    }

    async resendOtp(_id:string): Promise<Res> {
        try {

            const userData:UserDoc | null = await this.adminRepo.findAdminById(_id)
            if(!userData) return {status:false,message:"Cant find the user"}

            const otp:string = await sendVerifyMail(userData.name,userData.email)
            const otpData:OtpDoc | null = await this.otpRepo.createOrUpdateOtp(userData.email,otp);

            return otpData ? {data:otpData,status:true ,message:"Otp sended"} : {status:false ,message:"Can't find the otp"}

        } catch (error) {
            console.error("Error in resendOtp:", error);
            throw error;
        }
    }
}

export default AdminServices;
