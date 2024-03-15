import {Request,Response} from "express"
import UserServices from "../services/userServices";
import { UserData, ResErr } from "../interfaces/IUser";



class UserController{
    private userService:UserServices

    constructor(userService:UserServices){
        this.userService = userService
    }

    async signup(req:Request,res:Response):Promise<void>{
        try {
    
            const {name,phone,email,password}:UserData = req.body

            if (!name || !phone || !email || !password) {
                res.status(400).json({ error: "Missing required fields" });
                return;
            }

            const result:UserData | ResErr = await this.userService.createUser(name,phone,email,password)
            res.json(result)

        } catch (error) {
             console.error("Error in UserController.signup:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}


export default UserController