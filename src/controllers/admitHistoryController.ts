import {Request,Response} from "express"
import AdmitHistoryServices from "../services/admitHistoryServices";
import { Res } from '../interfaces/Icommon';


class AdmitHistoryController{
    private admitHistoryServices:AdmitHistoryServices

    constructor(admitHistoryServices:AdmitHistoryServices){
        this.admitHistoryServices = admitHistoryServices
    }


    async getAdmitHistoryDetails(req:Request,res:Response):Promise<void>{
        try {
            
            const {_id} = req.params
            const result: Res | null = await this.admitHistoryServices.getAdmitHistoryDetails(_id)  
            res.json(result)
            
        } catch (error) {
            console.error("Error in AdmitHistoryController.getAdmitHistoryDetails:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async getAllAdmitHistory(req:Request,res:Response):Promise<void>{
        try {
            
            const {search,charge,filterData,sortBy,sortIn,page} = req.query
            const result: Res | null = await this.admitHistoryServices.getAllAdmitHistory({search,charge,filterData,sortBy,sortIn,page})  
            res.json(result)
            
        } catch (error) {
            console.error("Error in AdmitHistoryController.getAllAdmitHistory:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async totalAdmits(req:Request,res:Response):Promise<void>{
        try {
            
            const {search,charge,filterData,sortBy,sortIn,page} = req.query
            const result: Res | null = await this.admitHistoryServices.totalAdmits({search,charge,filterData,sortBy,sortIn,page})  
            res.json(result)
            
        } catch (error) {
            console.error("Error in AdmitHistoryController.totalAdmits:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async totalDoctorAdmits(req:Request,res:Response):Promise<void>{
        try {
            const {_id} = req.params
            const {search,charge,filterData,sortBy,sortIn,page} = req.query
            const result: Res | null = await this.admitHistoryServices.totalAdmits({search,charge,filterData,sortBy,sortIn,page},_id)  
            res.json(result)
            
        } catch (error) {
            console.error("Error in AdmitHistoryController.totalAdmits:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async getMonthlyRevenue(_req:Request,res:Response):Promise<void>{
        try {
            const result: Res | null = await this.admitHistoryServices.getMonthlyRevenue(0.5)  
            res.json(result)
            
        } catch (error) {
            console.error("Error in appointmentController.getMonthlyRevenue", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async getDoctorMonthlyRevenue(req:Request,res:Response):Promise<void>{
        try {
            const {_id} = req.params
            const result: Res | null = await this.admitHistoryServices.getMonthlyRevenue(0.5,_id)  
            res.json(result)
            
        } catch (error) {
            console.error("Error in appointmentController.getDoctorMonthlyRevenue", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

}


export default AdmitHistoryController