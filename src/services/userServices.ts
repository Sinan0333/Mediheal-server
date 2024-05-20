import bcrypt from 'bcrypt';
import UserRepositories from "../repositories/userRepositories";
import { DecodedJWT, UserDoc, UserRes } from '../interfaces/IUser';
import { generateRefreshToken, generateToken, verifyToken } from '../utils/jwt';
import OtpRepositories from '../repositories/otpRepositories';
import { sendVerifyMail } from '../utils/otpVerification';
import { FilterCondition, Res } from '../interfaces/Icommon';
import { uploadFile } from '../utils/cloudinary';
import { OtpDoc } from '../interfaces/IOtp';
import { error } from 'console';
import { Stripe } from 'stripe'
import { jwtDecode } from "jwt-decode";     


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

    async googleAuth(credential:string): Promise<UserRes> {
        try {
            
            const userGoogleData:DecodedJWT = jwtDecode(credential)
            if(!userGoogleData.email || !userGoogleData.name) return {status:false,message:"Something Wrong Please Try Another Account"}

            // Check if email already exists
            const checkEmail: UserDoc | null = await this.userRepo.findUserByEmail(userGoogleData.email);
            if(checkEmail){
                const token: string = generateToken(checkEmail);
                const refreshToken:string = generateRefreshToken(checkEmail)
                return {userData:checkEmail,token,refreshToken,status: true, message: 'Login Successful' };
            } 
                

            // Create user
            const userData:UserDoc | null = await this.userRepo.createUser(userGoogleData.name,"0", userGoogleData.email, "0",true);
            if(!userData) throw error

            const token: string = generateToken(userData);
            const refreshToken:string = generateRefreshToken(userData)
            return {userData,token,refreshToken,status: true, message: 'User Signup successfully' };
        } catch (error) {
            console.error("Error in googleSignup:", error);
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
            return otpData ? {data:otpData,status:true ,message:"Otp get"} : {status:false ,message:"Can't find the otp"}

        } catch (error) {
            console.error("Error in getOtp:", error);
            throw error;
        }
    }

    async resendOtp(_id:string): Promise<Res> {
        try {

            const userData:UserDoc | null = await this.userRepo.findUserById(_id)
            if(!userData) return {status:false,message:"Cant find the user"}

            const otp:string = await sendVerifyMail(userData.name,userData.email)
            const otpData:OtpDoc | null = await this.otpRepo.createOrUpdateOtp(userData.email,otp);

            return otpData ? {data:otpData,status:true ,message:"Otp get"} : {status:false ,message:"Can't find the otp"}

        } catch (error) {
            console.error("Error in resendOtp:", error);
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
                        const token: string = generateToken(userData);
                        const refreshToken:string = generateRefreshToken(userData)
                        return { userData, token,refreshToken, status: true, message: 'Authentication successful' };
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

    async refreshToken(token:string): Promise<Res> {
        try {

           const decodedToken = verifyToken(token);
           const userData:UserDoc | null = await this.userRepo.findUserById(decodedToken._id)

           if(!userData) return {status:false,message:"Cant find the user"}
           if(userData.is_blocked)  throw new Error("Token verification failed")

           const accessToken:string = generateToken(userData)
           const refreshToken:string = generateRefreshToken(userData)

            return {status:true ,data:{accessToken,refreshToken} ,message:"Token refreshed"}

        } catch (error) {
            console.error("Error in refreshToken:", error);
            throw error;
        }
    }

    async listUsers(filterCondition:FilterCondition): Promise<Res> {
        try {
            const userData:UserDoc[] | null= await this.userRepo.findUsers(filterCondition)
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
            const CLIENT_URL = process.env.CLIENT_URL 
            const  STRIPE_SECRET = process.env.STRIPE_SECRET  || ""
            const stripe = new Stripe(STRIPE_SECRET , {
                apiVersion: '2023-10-16', 
            })

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
                success_url: `${CLIENT_URL}/payment_success`,
                cancel_url : `${CLIENT_URL}/payment_cancel`,
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

    async totalUsers(filterCondition:FilterCondition): Promise<Res> {
        try {

            const count:Number = await this.userRepo.countDocuments(filterCondition);
            return { data: count, status: true, message: "Total Users count" };

        } catch (error) {
            console.error("Error in countDocuments:", error);
            throw error;
        }
    }

    async walletPayment(_id:string,amount:number): Promise<Res> {
        try {

            const userData:UserDoc | null = await this.userRepo.findUserById(_id)
            if(!userData) return {status:false,message:"Cant find the user"}

            if(userData.wallet < amount) return {status:false,message:"Insufficient balance"}

            const updateWallet:UserDoc | null = await this.userRepo.updateHistory(_id,{date:new Date(),description:"Wallet payment",amount:-amount})
            return { data:updateWallet , status: true, message: "Wallet payment successful" };

        } catch (error) {
            console.error("Error in walletPayment:", error);
            throw error;
        }
    }

}

export default UserServices;
