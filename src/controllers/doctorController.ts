import {Request,Response} from "express"
import DoctorServices from "../services/doctorServices";
import { DoctorDoc } from '../interfaces/IDoctor';
import { Res } from '../interfaces/Icommen';



class DoctorController{
    private doctorServices:DoctorServices

    constructor(doctorServices:DoctorServices){
        this.doctorServices = doctorServices
    }


    async addDoctor(req:Request,res:Response):Promise<void>{
        try {
            
            const {firstName,secondName,dob,age,gender,address,experience,phone,email,password,department,workingDays,image}:DoctorDoc = req.body
            const result: Res | null = await this.doctorServices.addDoctor({firstName,secondName,dob,age,gender,address,experience,phone,email,password,department,workingDays,image})  
            res.json(result)
            
        } catch (error) {
            console.error("Error in Department.addDepartment:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

}


export default DoctorController