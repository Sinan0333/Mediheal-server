import DepartmentRepositories from "../repositories/departmentRepositories";
import { IDepartmentData} from '../interfaces/IDepartment';
import { Res } from '../interfaces/Icommen';
import {uploadFile} from "../utils/cloudinary";




class DepartmentServices{
    private departmentRepo:DepartmentRepositories
    
    constructor(departmentRepo:DepartmentRepositories){
        this.departmentRepo = departmentRepo
    }


    async checkExistingDepartment(name:string):Promise<Boolean>{
        const departmentData =await  this.departmentRepo.findDepartmentByName(name)
        return departmentData? true : false
    }


    async addDepartment({name,title,description,logo,image}:IDepartmentData):Promise<Res | null>{
        try {
            if (!name || !title || !description || !logo || !image) {
                return {status:false,message:'Missing required fields'}
            }
    
            const existingDepartment = await this.checkExistingDepartment(name)
            if(existingDepartment) return {status:false,message:"Department name is already exist"}
    
            const logoPublicId = await uploadFile(logo,"department_logos")
            const imagePublilcId = await uploadFile(image,"department_images")
    
            const departmentData = await this.departmentRepo.createDepartment(name,title,description,logo=logoPublicId,image=imagePublilcId)
            return {data:departmentData,status:true,message:"Department added successfully"}
        } catch (error) {
            console.log("Error in addDepartment:",error);
            return null
        }
    }

    async listDepartment(is_blocked:Boolean):Promise<Res | null>{
        try {

            const departmentData:IDepartmentData[] = await this.departmentRepo.findDepartment()
            const filteredData:IDepartmentData[] = departmentData.filter(obj=> obj.is_blocked===is_blocked)
            return {data:filteredData,status:true,message:'Complete list of departments'}
            
        } catch (error) {
            console.log("Error in listDepartment:",error);
            return null
        }
    }

}

export  default DepartmentServices