import {Request,Response} from "express"
import UserServices from "../services/userServices";
import { UserData, UserRes } from "../interfaces/IUser";
import { setCookies } from "../utils/cookies";



class UserController{
    private userService:UserServices

    constructor(userService:UserServices){
        this.userService = userService
    }

    async signup(req:Request,res:Response):Promise<void>{
        try {
    
            const {name,phone,email,password}:UserData = req.body
            const result:UserRes = await this.userService.createUser(name,phone,email,password)
          
            res.json(result)

        } catch (error) {
             console.error("Error in UserController.signup:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async login(req:Request,res:Response):Promise<void>{
        try {
            const {email,password}:UserData = req.body
            const result:UserRes = await this.userService.authUser(email,password)
            if(result.token){
                setCookies(res,result.token)
            }
            res.json(result)
            
        } catch (error) {
            console.error("Error in UserController.login:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}


export default UserController