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

    async getAllAdmitHistory(_req:Request,res:Response):Promise<void>{
        try {
            
            const result: Res | null = await this.admitHistoryServices.getAllAdmitHistory()  
            res.json(result)
            
        } catch (error) {
            console.error("Error in AdmitHistoryController.getAllAdmitHistory:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async totalAdmits(_req:Request,res:Response):Promise<void>{
        try {
            
            const result: Res | null = await this.admitHistoryServices.totalAdmits()  
            res.json(result)
            
        } catch (error) {
            console.error("Error in AdmitHistoryController.totalAdmits:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

}


export default AdmitHistoryController