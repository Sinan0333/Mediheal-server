import {Request,Response} from "express"
import AdminServices from "../services/adminServices";
import { UserDoc, UserRes } from "../interfaces/IUser";
import { Res } from "../interfaces/Icommon";


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

    async refreshToken(req:Request,res:Response):Promise<void>{
        try {

            const {refreshToken} = req.body
            if (!refreshToken) {
                res.status(401).json({ message: 'Unauthorized: No token provided' });
            }

            const result:Res | null = await this.adminServices.refreshToken(refreshToken)
            res.json(result)
            
        } catch (error:any) {
            if(error.message === 'Token expired'){
                res.status(401).json({ message: 'Unauthorized: Token expired' });
                return
            }else{
                res.status(500).json({ error: "Internal server error" });
                return
            }
        }
    }
}


export default AdminController