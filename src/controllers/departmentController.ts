import {Request,Response} from "express"
import DepartmentServices from "../services/departmentServices";
import { DepartmentDoc, IDepartmentData } from '../interfaces/IDepartment';
import { Res } from '../interfaces/Icommon';



class DepartmentController{
    private departmentServices:DepartmentServices

    constructor(departmentServices:DepartmentServices){
        this.departmentServices = departmentServices
    }


    async addDepartment(req:Request,res:Response):Promise<void>{
        try {
            
            const {name,title,description,logo,image}:IDepartmentData = req.body
            const result: Res | null = await this.departmentServices.addDepartment({ name, title, description, logo, image })  
            res.json(result)
            
        } catch (error) {
            console.error("Error in Department.addDepartment:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async editDepartment(req:Request,res:Response):Promise<void>{
        try {
            
            const {name,title,description,logo,image}:IDepartmentData = req.body
            const {_id} = req.params
            const result: Res | null = await this.departmentServices.editDepartment(_id,{ name, title, description, logo, image })  
            res.json(result)
            
        } catch (error) {
            console.error("Error in Department.addDepartment:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async getDepartment(req:Request,res:Response):Promise<void>{
        try {
            
            const {_id} = req.params
            const result: Res | null = await this.departmentServices.getDepartmentData(_id)  
            res.json(result)
            
        } catch (error) {
            console.error("Error in Department.getDepartment:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async listDepartment(req:Request,res:Response):Promise<void>{
        try {

            const {search,charge,filterData,sortBy,sortIn,page} = req.query
            const result : Res | null = await this.departmentServices.listDepartment({search,charge,filterData,sortBy,sortIn,page})
            res.json(result)

        } catch (error) {
            console.error("Error in Department.listDepartment:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async unBlockedDepartments(req:Request,res:Response):Promise<void>{
        try {

            const {search,charge,filterData,sortBy,sortIn,page} = req.query
            const isBlocked = false
            const result : Res | null = await this.departmentServices.listDepartment({search,charge,filterData,sortBy,sortIn,page},isBlocked)
            res.json(result)

        } catch (error) {
            console.error("Error in Department.unblockedDepartments:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async changeBlockStatus(req:Request,res:Response):Promise<void>{
        try {
            
            const {_id} = req.params
            const {is_blocked}:DepartmentDoc = req.body
            
            const result: Res | null = await this.departmentServices.changeBlockStatus(_id,is_blocked)  
            res.json(result)
            
        } catch (error) {
            console.error("Error in Department.addDoctor:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async totalDepartments(req:Request,res:Response):Promise<void>{
        try {
            
            const {search,charge,filterData,sortBy,sortIn,page} = req.query
            const result: Res | null = await this.departmentServices.totalDepartments({search,charge,filterData,sortBy,sortIn,page})  
            res.json(result)
            
        } catch (error) {
            console.error("Error in Department.totalDepartments:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
    
}


export default DepartmentController