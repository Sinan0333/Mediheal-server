import {Request,Response} from "express"
import DepartmentServices from "../services/departmentServices";
import { IDepartmentData } from '../interfaces/IDepartment';
import { Res } from '../interfaces/Icommen';



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
}


export default DepartmentController