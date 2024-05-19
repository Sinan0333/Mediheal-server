import {Request,Response} from "express"
import UserServices from "../services/userServices";
import { UserDoc, UserRes } from "../interfaces/IUser";
import { Res } from "../interfaces/Icommon";



class UserController{
    private userService:UserServices

    constructor(userService:UserServices){
        this.userService = userService
    }

    async signup(req:Request,res:Response):Promise<void>{
        try {
    
            const {name,phone,email,password}:UserDoc = req.body
            const result:UserRes |null = await this.userService.createUser(name,phone,email,password)
            res.json(result)

        } catch (error) {
            console.error("Error in UserController.signup:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async googleAuth(req:Request,res:Response):Promise<void>{
        try {
    
            const {credential} = req.body
            const result:UserRes |null = await this.userService.googleAuth(credential)
            res.json(result)

        } catch (error) {
            console.error("Error in UserController.googleSignup:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async login(req:Request,res:Response):Promise<void>{
        try {
            
            const {email,password}:UserDoc = req.body
            const result:UserRes | null = await this.userService.authUser(email,password) 
            res.json(result)
            
        } catch (error) {
            console.error("Error in UserController.login:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async getOtp(req:Request,res:Response):Promise<void>{
        try {

            const {_id} = req.params
            const result:Res | null = await this.userService.getOtp(_id)
            res.json(result)
            
        } catch (error) {
            console.error("Error in UserController.login:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async resendOtp(req:Request,res:Response):Promise<void>{
        try {

            const {_id} = req.params
            const result:Res | null = await this.userService.resendOtp(_id)
            res.json(result)
            
        } catch (error) {
            console.error("Error in UserController.login:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    
    async verifyOtp(req:Request,res:Response):Promise<void>{
        try {

            const {_id,otp} = req.body
            const result:UserRes | null = await this.userService.verifyOtp(_id,otp)
            res.json(result)
            
        } catch (error) {
            console.error("Error in UserController.login:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async refreshToken(req:Request,res:Response):Promise<void>{
        try {

            const {refreshToken} = req.body
            if (!refreshToken) {
                res.status(401).json({ message: 'Unauthorized: No token provided' });
            }

            const result:Res | null = await this.userService.refreshToken(refreshToken)
            res.json(result)
            
        } catch (error:any) {
            console.error("Error in UserController.refreshToken:", error);
            if(error.message === 'Token expired' || error.name === 'Token verification failed'){
                res.status(401).json({ message: 'Unauthorized: Token expired' });
                return
            }else{
                res.status(500).json({ error: "Internal server error" });
            }
        }
    }

    async listUsers(req:Request,res:Response):Promise<void>{
        try {

            const {search,charge,filterData,sortBy,sortIn,page} = req.query
            const result:UserRes | null = await this.userService.listUsers({search,charge,filterData,sortBy,sortIn,page})
            res.json(result)
            
        } catch (error) {
            console.error("Error in UserController.login:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async getUserData(req:Request,res:Response):Promise<void>{
        try {

            const {_id} = req.body
            const result:UserRes | null = await this.userService.getUserData(_id)
            res.json(result)
            
        } catch (error) {
            console.error("Error in UserController.login:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async updateProfile(req:Request,res:Response):Promise<void>{
        try {
    
            const {_id,name,phone,email,password,newPassword,image} = req.body
            const result:UserRes |null = await this.userService.updateProfile(_id,name,phone,email,password,newPassword,image)
            res.json(result)

        } catch (error) {
             console.error("Error in UserController.signup:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async changeBlockStatus(req:Request,res:Response):Promise<void>{
        try {
            
            const {_id} = req.params
            const {is_blocked}:UserDoc = req.body
            
            const result: Res | null = await this.userService.changeBlockStatus(_id,is_blocked)  
            res.json(result)
            
        } catch (error) {
            console.error("Error in UserController.changeBLockStatus:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async createCheckoutSession(req:Request,res:Response):Promise<void>{
        try {

            const {amount} = req.body

            const result: Res | null = await this.userService.createCheckoutSession(amount)  
            res.json(result)
            
        } catch (error) {
            console.error("Error in UserController.createPaymentIntent:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async totalUsers(req:Request,res:Response):Promise<void>{
        try {
            
            const {search,charge,filterData,sortBy,sortIn,page} = req.query
            const result: Res | null = await this.userService.totalUsers({search,charge,filterData,sortBy,sortIn,page})  
            res.json(result)
            
        } catch (error) {
            console.error("Error in UserController.totalUsers:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async walletPayment(req:Request,res:Response):Promise<void>{
        try {
            
            const {_id,amount} = req.body
            const result: Res | null = await this.userService.walletPayment(_id,amount)  
            res.json(result)
            
        } catch (error) {
            console.error("Error in UserController.walletPayment:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}


export default UserController