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

    async adminProfile(req:Request,res:Response):Promise<void>{
        try {
            const { _id } = req.body as { _id: string };
            const result:UserRes | null= await this.adminServices.adminProfile(_id)
            res.json(result)
            
        } catch (error) {
            console.error("Error in AdminController.adminProfile:", error);
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

    async verifyEmail(req:Request,res:Response):Promise<void>{
        try {
            
            const {email} = req.body
            const result: Res | null = await this.adminServices.verifyEmail(email)  
            res.json(result)
            
        } catch (error) {
            console.error("Error in UserController.verifyEmail:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async getOtp(req:Request,res:Response):Promise<void>{
        try {

            const {_id} = req.params
            const result:Res | null = await this.adminServices.getOtp(_id)
            res.json(result)
            
        } catch (error) {
            console.error("Error in UserController.getOtp:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async verifyOtp(req:Request,res:Response):Promise<void>{
        try {

            const {_id,otp} = req.body
            const result:Res | null = await this.adminServices.verifyOtp(_id,otp)
            res.json(result)
            
        } catch (error) {
            console.error("Error in DoctorController.verifyOtp:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }


    async changePassword(req:Request,res:Response):Promise<void>{
        try {
            
            const {_id,password} = req.body
            const result: Res | null = await this.adminServices.changePassword(_id,password)  
            res.json(result)
            
        } catch (error) {
            console.error("Error in UserController.changePassword:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async resendOtp(req:Request,res:Response):Promise<void>{
        try {

            const {_id} = req.params
            const result:Res | null = await this.adminServices.resendOtp(_id)
            res.json(result)
            
        } catch (error) {
            console.error("Error in AdminController.login:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}


export default AdminController