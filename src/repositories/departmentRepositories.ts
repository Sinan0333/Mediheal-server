import { DepartmentDoc, IDepartmentData } from "../interfaces/IDepartment"
import Department from "../models/departmentModel"

class DepartmentRepository{

    async createDepartment(name:string,title:string,description:string,logo:string,image:string):Promise<DepartmentDoc>{
        const departmentModel = new Department({name,title,description,logo,image})
        return await departmentModel.save()
    }

    async findDepartmentByName(name:string):Promise<DepartmentDoc | null>{
        const departmentData = await Department.findOne({name:name})
        return departmentData
    }

    async findDepartment():Promise<IDepartmentData[]>{
      const departmentData:IDepartmentData[] = await Department.find()
      return departmentData
    }
}

export default DepartmentRepository