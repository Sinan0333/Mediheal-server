import {Request,Response} from "express"
import DoctorServices from "../services/doctorServices";
import { DoctorDoc } from '../interfaces/IDoctor';
import { Res } from '../interfaces/Icommon';



class DoctorController{
    private doctorServices:DoctorServices

    constructor(doctorServices:DoctorServices){
        this.doctorServices = doctorServices
    }


    async addDoctor(req:Request,res:Response):Promise<void>{
        try {
            
            const {firstName,secondName,dob,age,gender,address,experience,phone,email,password,department,workingDays,fees,image}:DoctorDoc = req.body
            const result: Res | null = await this.doctorServices.addDoctor({firstName,secondName,dob,age,gender,address,experience,phone,email,password,department,workingDays,fees,image})  
            res.json(result)
            
        } catch (error) {
            console.error("Error in DoctorController.addDoctor:", error);
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

}


export default DoctorController