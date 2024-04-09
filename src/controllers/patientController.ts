import {Request,Response} from "express"
import PatientServices from "../services/patientServices";
import { PatientDoc } from '../interfaces/IPatient';
import { Res } from '../interfaces/Icommon';



class PatientController{
    private patientServices:PatientServices

    constructor(patientServices:PatientServices){
        this.patientServices = patientServices
    }


    async addPatient(req:Request,res:Response):Promise<void>{
        try {
            
            const {userId,firstName,secondName,bloodGroup,dob,age,gender,image}:PatientDoc = req.body
            const result: Res | null = await this.patientServices.addPatient({userId,firstName,secondName,bloodGroup,dob,age,gender,image})  
            res.json(result)
            
        } catch (error) {
            console.error("Error in Department.addDepartment:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async getUserPatients(req:Request,res:Response):Promise<void>{
        try {
            
            const {userId} = req.params
            const result: Res | null = await this.patientServices.getUserPatients(userId)  
            res.json(result)
            
        } catch (error) {
            console.error("Error in Department.addDepartment:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async getPatients(_req:Request,res:Response):Promise<void>{
        try {
            
            const result: Res | null = await this.patientServices.getPatients()  
            res.json(result)
            
        } catch (error) {
            console.error("Error in Department.getPatients:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

}


export default PatientController