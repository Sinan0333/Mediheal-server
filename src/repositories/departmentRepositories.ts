import { DepartmentDoc } from "../interfaces/IDepartment";
import Department from "../models/departmentModel";

class DepartmentRepository {

    async createDepartment(name: string, title: string, description: string, logo: string, image: string): Promise<DepartmentDoc | null> {
        try {
            const departmentModel = new Department({ name, title, description, logo, image });
            const savedDepartment = await departmentModel.save();
            return savedDepartment;
        } catch (error) {
            console.error("Error creating department:", error);
            return null;
        }
    }

    async findDepartmentByName(name: string): Promise<DepartmentDoc | null> {
        try {
            const departmentData:DepartmentDoc | null = await Department.findOne({ name });
            return departmentData;
        } catch (error) {
            console.error("Error finding department by name:", error);
            return null;
        }
    }

    async findDepartments(): Promise<DepartmentDoc[] | null> {
        try {
            const departmentData: DepartmentDoc[] = await Department.find();
            return departmentData;
        } catch (error) {
            console.error("Error finding departments:", error);
            return null;
        }
    }

    async changeBlockStatus(_id:string,is_blocked:Boolean):Promise<DepartmentDoc | null>{
        try {
            const departmentData:DepartmentDoc | null = await Department.findOneAndUpdate({_id},{is_blocked:is_blocked},{new:true})
            return departmentData
        } catch (error) {
            console.error("Error changeBlockStatus:", error);
            return null;
        }
    }
}

export default DepartmentRepository;
