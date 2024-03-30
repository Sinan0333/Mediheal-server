import {Request,Response} from "express"
import DoctorServices from "../services/doctorServices";
import { DoctorDoc, DoctorRes } from '../interfaces/IDoctor';
import { Res } from '../interfaces/Icommon';
import { setCookies } from "../utils/cookies";
import { UserDoc } from "../interfaces/IUser";



class DoctorController{
    private doctorServices:DoctorServices

    constructor(doctorServices:DoctorServices){
        this.doctorServices = doctorServices
    }


    async addDoctor(req:Request,res:Response):Promise<void>{
        try {
            
            const {firstName,secondName,dob,age,gender,address,experience,phone,email,password,department,workingDays,fees,image,schedule}:DoctorDoc = req.body
            const result: Res | null = await this.doctorServices.addDoctor({firstName,secondName,dob,age,gender,address,experience,phone,email,password,department,workingDays,schedule,fees,image})  
            res.json(result)
            
        } catch (error) {
            console.error("Error in DoctorController.addDoctor:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async login(req:Request,res:Response):Promise<void>{
        try {
            const {email,password}:DoctorDoc = req.body
            const result:DoctorRes | null = await this.doctorServices.authDoctor(email,password)
            if(result?.token) setCookies(res,result.token)
            
            res.json(result)
            
        } catch (error) {
            console.error("Error in UserController.login:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async listDoctors(_req:Request,res:Response):Promise <void>{
        try {
            
            const result: Res | null = await this.doctorServices.listDoctors()
            res.json(result)

        } catch (error) {
            console.error("Error in doctorController.addDoctor:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async unBlockedDoctors(_req:Request,res:Response):Promise <void>{
        try {
            
            const result: Res | null = await this.doctorServices.listDoctors(false)
            res.json(result)

        } catch (error) {
            console.error("Error in doctorController.addDoctor:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async viewDoctor(req:Request,res:Response):Promise <void>{
        try {
            
            const {_id} = req.params
            const result: Res | null = await this.doctorServices.viewDoctor(_id)
            res.json(result)

        } catch (error) {
            console.error("Error in doctorController.viewDoctor:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async ediDoctor(req:Request,res:Response):Promise<void>{
        try {
            
            const {_id} = req.params
            
            const {firstName,secondName,dob,age,gender,address,experience,phone,email,password,department,workingDays,fees,image,schedule}:DoctorDoc = req.body
            const result: Res | null = await this.doctorServices.ediDoctor({firstName,secondName,dob,age,gender,address,experience,phone,email,password,department,workingDays,schedule,fees,image},_id)  
            res.json(result)
            
        } catch (error) {
            console.error("Error in DoctorController.addDoctor:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async changeBlockStatus(req:Request,res:Response):Promise<void>{
        try {
            
            const {_id} = req.params
            const {is_blocked}:UserDoc = req.body
            
            const result: Res | null = await this.doctorServices.changeBlockStatus(_id,is_blocked)  
            res.json(result)
            
        } catch (error) {
            console.error("Error in DoctorController.addDoctor:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }


}


export default DoctorController