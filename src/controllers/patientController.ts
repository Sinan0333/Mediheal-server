import {Request,Response} from "express"
import PatientServices from "../services/patientServices";
import { PatientDoc, UpdatePatientData } from '../interfaces/IPatient';
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
            console.error("Error in PatientController.addPatient:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async getUserPatients(req:Request,res:Response):Promise<void>{
        try {
            
            const {userId} = req.params
            const result: Res | null = await this.patientServices.getUserPatients(userId)  
            res.json(result)
            
        } catch (error) {
            console.error("Error in PatientController.addPatient:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async getPatients(req:Request,res:Response):Promise<void>{
        try {
            
            const {search,charge,filterData,sortBy,sortIn,page} = req.query
            const result: Res | null = await this.patientServices.getPatients({search,charge,filterData,sortBy,sortIn,page})  
            res.json(result)
            
        } catch (error) {
            console.error("Error in PatientController.getPatients:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async getPatient(req:Request,res:Response):Promise<void>{
        try {
            
            const {_id} = req.params
            const result: Res | null = await this.patientServices.getPatient(_id)  
            res.json(result)
            
        } catch (error) {
            console.error("Error in PatientController.getPatient:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async updatePatient(req:Request,res:Response):Promise<void>{
        try {
            
            const {_id} = req.params
            const {firstName,secondName,bloodGroup,dob,age,gender,image}:UpdatePatientData = req.body
            const result: Res | null = await this.patientServices.updatePatient(_id,{firstName,secondName,bloodGroup,dob,age,gender,image})  
            res.json(result)
            
        } catch (error) {
            console.error("Error in PatientController.updatePatient:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async totalPatients(req:Request,res:Response):Promise<void>{
        try {
            
            const {search,charge,filterData,sortBy,sortIn,page} = req.query
            const result: Res | null = await this.patientServices.totalPatients({search,charge,filterData,sortBy,sortIn,page})  
            res.json(result)
            
        } catch (error) {
            console.error("Error in DoctorController.totalPatients:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

}


export default PatientController