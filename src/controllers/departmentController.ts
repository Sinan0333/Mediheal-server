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

    async listDepartment(_req:Request,res:Response):Promise<void>{
        try {

            const result : Res | null = await this.departmentServices.listDepartment()
            res.json(result)

        } catch (error) {
            console.error("Error in Department.listDepartment:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async unBlockedDepartments(_req:Request,res:Response):Promise<void>{
        try {
            const isBlocked = false
            const result : Res | null = await this.departmentServices.listDepartment(isBlocked)
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
            console.error("Error in DoctorController.addDoctor:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}


export default DepartmentController