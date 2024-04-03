import {Request,Response} from "express"
import BedServices from "../services/bedServices";
import { BedDoc} from '../interfaces/IBed';
import { Res } from '../interfaces/Icommon';



class BedController{
    private bedServices:BedServices

    constructor(bedServices:BedServices){
        this.bedServices = bedServices
    }


    async addBed(req:Request,res:Response):Promise<void>{
        try {
            
            const {type,charge}:BedDoc = req.body
            const result: Res | null = await this.bedServices.addBed({type,charge,available:true,is_blocked:false})  
            res.json(result)
            
        } catch (error) {
            console.error("Error in Department.addBed:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async getBedDetails(req:Request,res:Response):Promise<void>{
        try {
            
            const {_id} = req.params
            const result: Res | null = await this.bedServices.getBedDetails(_id)  
            res.json(result)
            
        } catch (error) {
            console.error("Error in Department.getBedDetails:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async getAllBeds(_req:Request,res:Response):Promise<void>{
        try {
            
            const result: Res | null = await this.bedServices.getAllBeds()  
            res.json(result)
            
        } catch (error) {
            console.error("Error in Department.getBedDetails:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async changeBlockStatus(req:Request,res:Response):Promise<void>{
        try {
            
            const {_id} = req.params
            const {is_blocked}:BedDoc = req.body
            
            const result: Res | null = await this.bedServices.changeBlockStatus(_id,is_blocked)  
            res.json(result)
            
        } catch (error) {
            console.error("Error in DoctorController.changeBlockStatus:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async assignPatient(req:Request,res:Response):Promise<void>{
        try {
            
            const {patient,type,assignDate,dischargeDate,description,assignBy}:BedDoc = req.body
            const result: Res | null = await this.bedServices.assignPatient({patient,type,assignDate,dischargeDate,description,assignBy,available:false})  
            res.json(result)
            
        } catch (error) {
            console.error("Error in BedController.assignPatient:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

}


export default BedController