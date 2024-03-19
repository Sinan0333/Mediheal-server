import {Request,Response} from "express"
import AdminServices from "../services/adminServices";
import { UserData, UserRes } from "../interfaces/IUser";
import { setCookies } from "../utils/cookies";



class AdminController{
    private adminServices:AdminServices

    constructor(adminServices:AdminServices){
        this.adminServices = adminServices
    }


    async login(req:Request,res:Response):Promise<void>{
        try {
            const {email,password}:UserData = req.body
            const result:UserRes | null= await this.adminServices.authAdmin(email,password)
            if(result?.token) setCookies(res,result.token)
            res.json(result)
            
        } catch (error) {
            console.error("Error in AdminController.login:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}


export default AdminController