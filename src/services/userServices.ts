import bcrypt from 'bcrypt';
import UserRepositories from "../repositories/userRepositories";
import { UserDoc, UserRes } from '../interfaces/IUser';
import { generateToken } from '../utils/jwt';
import OtpRepositories from '../repositories/otpRepositories';
import { sendVerifyMail } from '../utils/otpVerification';
import { Res } from '../interfaces/Icommon';
import { uploadFile } from '../utils/cloudinary';
import { OtpDoc } from '../interfaces/IOtp';

class UserServices {
    private userRepo: UserRepositories;
    private otpRepo:OtpRepositories

    constructor(userRepo: UserRepositories ,otpRepo:OtpRepositories) {
        this.userRepo = userRepo;
        this.otpRepo = otpRepo
    }

    async checkExistingEmail(email: string): Promise<boolean> {
        try {
            const userData:UserDoc | null = await this.userRepo.findUserByEmail(email);
            return !!userData;
        } catch (error) {
            console.error("Error in checkExistingEmail:", error);
            return false;
        }
    }

    async createUser(name: string, phone: string , email: string, password: string): Promise<UserRes | null> {
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

            const otp:string = await sendVerifyMail(name,email)
            await this.otpRepo.createOrUpdateOtp(email,otp)

            // Hash the password
            const hashedPass: string = await bcrypt.hash(password, 10);

            // Create user
            const userData:UserDoc | null = await this.userRepo.createUser(name, phone, email, hashedPass);
            return {userData,status: true, message: 'User created successfully' };
        } catch (error) {
            console.error("Error in createUser:", error);
            return null;
        }
    }

    async verifyOtp(_id:string,otp:string): Promise<UserRes | null> {
        try {

            const userData:UserDoc | null = await this.userRepo.findUserById(_id)
            const otpData:OtpDoc | null = await this.otpRepo.findOtpByEmail(userData?.email);

            if(otpData?.otp == otp){
                const userData:UserDoc | null = await this.userRepo.findUserByIdAndUpdate(_id,{verified:true})
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
            const otpData:OtpDoc | null = await this.otpRepo.findOtpByEmail(userData?.email);
            return otpData ? {data:otpData.otp,status:true ,message:"Otp get"} : {status:false ,message:"Can't find the otp"}

        } catch (error) {
            console.error("Error in authUser:", error);
            return null;
        }
    }


    async authUser(email: string, password: string): Promise<UserRes | null> {
        try {
            const userData:UserDoc | null = await this.userRepo.findUserByEmail(email);
            if (userData) {
                const isPasswordValid:Boolean = await bcrypt.compare(password, userData.password);
                if (isPasswordValid) {
                    if(userData.is_blocked){
                        return{status:false,message:"Admin blocked you"}
                    }else{
                        const token: string = generateToken(userData._id);
                        return { userData, token, status: true, message: 'Authentication successful' };
                    }
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

    async listUsers(): Promise<Res | null> {
        try {
            const userData:UserDoc[] | null= await this.userRepo.findUsers()
            return {data:userData,status:true, message:'Users find successful'}

        } catch (error) {
            console.error("Error in listUsers:", error);
            return null;
        }
    }

    async getUserData(_id:string): Promise<Res | null> {
        try {

            const userData:UserDoc | null= await this.userRepo.findUserById(_id)
            return {data:userData,status:true, message:'User find successful'}

        } catch (error) {
            console.error("Error in getUserData:", error);
            return null;
        }
    }

    async updateProfile(_id:string,name: string, phone: string , email: string, password: string ,newPassword:string,image:string): Promise<UserRes | null> {
        try {

            const oldUserData:UserDoc | null = await this.userRepo.findUserById(_id)
            let newImage:string = ""
            
            if(password && oldUserData){

                const isMatch:Boolean = await bcrypt.compare(password,oldUserData.password);
                
                if(isMatch){

                    if(image){
                        if(image !== oldUserData.image){
                            newImage = await uploadFile(image, "user_profile");
                        }else{
                            newImage = oldUserData.image
                        }
                    }else{
                        newImage = oldUserData.image
                    }

                    const hashedPass: string = await bcrypt.hash(newPassword, 10);
                    const userData:UserDoc | null = await this.userRepo.findUserByIdAndUpdate(_id,{name,phone,email,password:hashedPass,image:newImage})
                    return { userData, status: true, message: 'Profile Updated successfully' };

                }else{
                    return {status:false,message:"Incorrect password"}
                }
            }


            if(oldUserData){

                if(image){
                    if(image !== oldUserData.image){
                        newImage = await uploadFile(image, "user_profile");
                    }else{
                        newImage = oldUserData.image
                    }
                }else{
                    newImage = oldUserData.image
                }

                const userData:UserDoc | null = await this.userRepo.findUserByIdAndUpdate(_id,{name,phone,email,image:newImage})
                return { userData, status: true, message: 'Profile Updated successfully' };
            }

            return {status:false ,message:"Something wrong"}

        } catch (error) {
            console.error("Error in createUser:", error);
            return null;
        }
    }

}

export default UserServices;
