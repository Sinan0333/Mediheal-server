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

    async getAllBeds(req:Request,res:Response):Promise<void>{
        try {
            
            const {search,charge,filterData,sortBy,sortIn,page} = req.query
            const result: Res | null = await this.bedServices.getAllBeds({search,charge,filterData,sortBy,sortIn,page})  
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
            
            const {patient,type,assignDate,dischargeDate,description,assignBy,charge}:BedDoc = req.body
            const result: Res | null = await this.bedServices.assignPatient({patient,type,assignDate,dischargeDate,description,assignBy,charge,available:false})  
            res.json(result)
            
        } catch (error) {
            console.error("Error in BedController.assignPatient:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async updateBed(req:Request,res:Response):Promise<void>{
        try {
            const {_id} = req.params
            const {patient,type,charge,assignDate,dischargeDate,description,assignBy,available}:BedDoc = req.body
            
            const result: Res | null = await this.bedServices.updateBed(_id,{patient,type,charge,assignDate,dischargeDate,description,assignBy,available})  
            res.json(result)
            
        } catch (error) {
            console.error("Error in BedController.assignPatient:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async updateBedTypeAndCharge(req:Request,res:Response):Promise<void>{
        try {
            const {_id} = req.params
            const {type,charge,is_blocked}:BedDoc = req.body
            
            const result: Res | null = await this.bedServices.updateBedTypeAndCharge(_id,type,charge,is_blocked)  
            res.json(result)
            
        } catch (error) {
            console.error("Error in BedController.assignPatient:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async dischargePatient(req:Request,res:Response):Promise<void>{
        try {
            
            const {_id} = req.params
            const result: Res | null = await this.bedServices.dischargePatient(_id)  
            res.json(result)
            
        } catch (error) {
            console.error("Error in BedController.dischargePatient:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async totalBeds(req:Request,res:Response):Promise<void>{
        try {
            const {search,charge,filterData,sortBy,sortIn,page} = req.query
            const result: Res | null = await this.bedServices.totalBeds({search,charge,filterData,sortBy,sortIn,page})  
            res.json(result)
            
        } catch (error) {
            console.error("Error in BedController.totalBeds:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async totalVacantBeds(_req:Request,res:Response):Promise<void>{
        try {
            
            const result: Res | null = await this.bedServices.totalVacantBeds()  
            res.json(result)
            
        } catch (error) {
            console.error("Error in BedController.totalFreeBeds:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

}


export default BedController