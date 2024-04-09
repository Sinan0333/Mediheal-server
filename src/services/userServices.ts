import bcrypt from 'bcrypt';
import UserRepositories from "../repositories/userRepositories";
import { UserDoc, UserRes } from '../interfaces/IUser';
import { generateToken } from '../utils/jwt';
import OtpRepositories from '../repositories/otpRepositories';
import { sendVerifyMail } from '../utils/otpVerification';
import { Res } from '../interfaces/Icommon';
import { uploadFile } from '../utils/cloudinary';
import { OtpDoc } from '../interfaces/IOtp';
import { error } from 'console';

import { Stripe } from 'stripe'
let stripe:any
if(process.env.STRIPE_SECRET){
    stripe = new Stripe(process.env.STRIPE_SECRET, {
        apiVersion: '2023-10-16', 
    });
}

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
            throw error;
        }
    }

    async createUser(name: string, phone: string , email: string, password: string): Promise<UserRes> {
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
            if(!userData) throw error
            return {userData,status: true, message: 'User Signup successfully' };
        } catch (error) {
            console.error("Error in createUser:", error);
            throw error;
        }
    }

    async verifyOtp(_id:string,otp:string): Promise<UserRes> {
        try {

            const userData:UserDoc | null = await this.userRepo.findUserById(_id)
            if(!userData) throw error
            const otpData:OtpDoc | null = await this.otpRepo.findOtpByEmail(userData.email);
            if(!otpData) throw error

            if(otpData.otp == otp){
                const userData:UserDoc | null = await this.userRepo.findUserByIdAndUpdate(_id,{verified:true})
                return { userData, status: true, message: 'Verification successful' };
            }else{
                return {status:false ,message:"Otp verification filed"}
            }

        } catch (error) {
            console.error("Error in verifyOtp:", error);
            throw error;
        }
    }

    async getOtp(_id:string): Promise<Res> {
        try {

            const userData:UserDoc | null = await this.userRepo.findUserById(_id)
            if(!userData) return {status:false,message:"Cant find the user"}
            const otpData:OtpDoc | null = await this.otpRepo.findOtpByEmail(userData?.email);
            return otpData ? {data:otpData.otp,status:true ,message:"Otp get"} : {status:false ,message:"Can't find the otp"}

        } catch (error) {
            console.error("Error in getOtp:", error);
            throw error;
        }
    }


    async authUser(email: string, password: string): Promise<UserRes> {
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
            throw error;
        }
    }

    async listUsers(): Promise<Res> {
        try {
            const userData:UserDoc[] | null= await this.userRepo.findUsers()
            return {data:userData,status:true, message:'Users find successful'}

        } catch (error) {
            console.error("Error in listUsers:", error);
            throw error;
        }
    }

    async getUserData(_id:string): Promise<Res> {
        try {

            const userData:UserDoc | null= await this.userRepo.findUserById(_id)
            if(!userData) return {status:false,message:"Cant find the user"}
            return {data:userData,status:true, message:'User find successful'}

        } catch (error) {
            console.error("Error in getUserData:", error);
            throw error;
        }
    }

    async updateProfile(_id:string,name: string, phone: string , email: string, password: string ,newPassword:string,image:string): Promise<UserRes | null> {
        try {

            const oldUserData:UserDoc | null = await this.userRepo.findUserById(_id)
            if(!oldUserData) return {status:false,message:'Cant find the user'}
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
                    if(!userData) return {status:false,message:"Something error in updating the data"}
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
            console.error("Error in updateProfile:", error);
            throw error;
        }
    }

    async changeBlockStatus(_id:string,is_blocked:Boolean): Promise<Res> {
        try {

            const userData:UserDoc | null = await this.userRepo.changeBlockStatus(_id,is_blocked)
            if(!userData) return {status:false,message:"Cant find the user"}
            return {data:userData,status:true,message:`User is ${is_blocked ? "blocked" : "unblocked"}`}
            
        } catch (error) {
            console.error("Error in changeBlockStatus:", error);
            throw error;
        }
    }

    async createCheckoutSession(amount:number):Promise<Res>{
        try {

            let line_items = [
                {
                    price_data:{
                        currency:'inr',
                        product_data:{
                            name:"Booking"
                        },
                        unit_amount : amount*100
                    },
                    quantity:1
                }
            ]
            const session = await stripe.checkout.sessions.create({
                success_url: 'http://localhost:5173/payment_success',
                cancel_url : 'http://localhost:5173/payment_cancel',
                line_items:line_items,  
                mode: 'payment',
                billing_address_collection:'required',
              });
              
              return {data:session.id,status:true,message:"Create checkout session successful"};

        } catch (error) {
            console.error("Error in createCheckoutSession:", error);
            throw error;
        }
    }

}

export default UserServices;
