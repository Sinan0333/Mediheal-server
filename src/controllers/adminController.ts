import {Request,Response} from "express"
import AdminServices from "../services/adminServices";
import { UserDoc, UserRes } from "../interfaces/IUser";


class AdminController{
    private adminServices:AdminServices

    constructor(adminServices:AdminServices){
        this.adminServices = adminServices
    }


    async login(req:Request,res:Response):Promise<void>{
        try {
            const {email,password}:UserDoc = req.body
            const result:UserRes | null= await this.adminServices.authAdmin(email,password)
            res.json(result)
            
        } catch (error) {
            console.error("Error in AdminController.login:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}


export default AdminController