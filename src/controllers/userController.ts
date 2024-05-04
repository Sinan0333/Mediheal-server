import {Request,Response} from "express"
import UserServices from "../services/userServices";
import { UserDoc, UserRes } from "../interfaces/IUser";
import { setCookies } from "../utils/cookies";
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

    async login(req:Request,res:Response):Promise<void>{
        try {
            
            const {email,password}:UserDoc = req.body
            const result:UserRes | null = await this.userService.authUser(email,password)
            
            if(result?.token) setCookies(res,result.token,"userToken")  
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

    async listUsers(_req:Request,res:Response):Promise<void>{
        try {

            const result:UserRes | null = await this.userService.listUsers()
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

    async totalUsers(_req:Request,res:Response):Promise<void>{
        try {
            
            const result: Res | null = await this.userService.totalUsers()  
            res.json(result)
            
        } catch (error) {
            console.error("Error in UserController.totalUsers:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}


export default UserController