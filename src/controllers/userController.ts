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
            if(result?.token) setCookies(res,result.token)
            res.json(result)
            
        } catch (error) {
            console.error("Error in UserController.login:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async getOtp(req:Request,res:Response):Promise<void>{
        try {

            const {_id} = req.body
            const result:Res | null = await this.userService.getOtp(_id)
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
}


export default UserController