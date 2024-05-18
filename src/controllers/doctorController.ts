import {Request,Response} from "express"
import DoctorServices from "../services/doctorServices";
import { DoctorDoc, DoctorRes } from '../interfaces/IDoctor';
import { Res } from '../interfaces/Icommon';
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
            res.json(result)
            
        } catch (error) {
            console.error("Error in DoctorController.login:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async refreshToken(req:Request,res:Response):Promise<void>{
        try {

            const {refreshToken} = req.body
            if (!refreshToken) {
                res.status(401).json({ message: 'Unauthorized: No token provided' });
            }
            
            const result:Res | null = await this.doctorServices.refreshToken(refreshToken)
            res.json(result)
            return
            
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

    async listDoctors(req:Request,res:Response):Promise <void>{
        try {
            
            const {search,charge,filterData,sortBy,sortIn,page} = req.query
            const result: Res | null = await this.doctorServices.listDoctors({search,charge,filterData,sortBy,sortIn,page})
            res.json(result)

        } catch (error) {
            console.error("Error in doctorController.addDoctor:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async unBlockedDoctors(req:Request,res:Response):Promise <void>{
        try {
            
            const {search,charge,filterData,sortBy,sortIn,page} = req.query
            const result: Res | null = await this.doctorServices.listDoctors({search,charge,filterData,sortBy,sortIn,page},false)
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

    async getBestDoctors(req:Request,res:Response):Promise<void>{
        try {
            
            const {search,charge,filterData,sortBy,sortIn,page} = req.query
            const result: Res | null = await this.doctorServices.bestDoctors({search,charge,filterData,sortBy,sortIn,page})
            res.json(result)
            
        } catch (error) {
            console.error("Error in DoctorController.addDoctor:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async takeABreak(req:Request,res:Response):Promise<void>{
        try {
            const {scheduleId} = req.params
            const {_id,day} = req.body
            const result: Res | null = await this.doctorServices.takeABreak(scheduleId,day,_id)
            res.json(result)
            
        } catch (error) {
            console.error("Error in DoctorController.takeABreak:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async removeBreak(req:Request,res:Response):Promise<void>{
        try {
            const {scheduleId} = req.params
            const {_id,day} = req.body
            const result: Res | null = await this.doctorServices.removeBreak(scheduleId,day,_id)
            res.json(result)
            
        } catch (error) {
            console.error("Error in DoctorController.takeABreak:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async totalDoctors(req:Request,res:Response):Promise<void>{
        try {

            const {search,charge,filterData,sortBy,sortIn,page} = req.query
            const result: Res | null = await this.doctorServices.totalDoctors({search,charge,filterData,sortBy,sortIn,page})  
            res.json(result)
            
        } catch (error) {
            console.error("Error in DoctorController.totalDoctors:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}


export default DoctorController