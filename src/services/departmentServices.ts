import DepartmentRepository from "../repositories/departmentRepositories";
import { IDepartmentData, DepartmentDoc } from '../interfaces/IDepartment';
import { Res } from '../interfaces/Icommon';
import { uploadFile } from "../utils/cloudinary";

class DepartmentServices {
    private departmentRepo: DepartmentRepository;

    constructor(departmentRepo: DepartmentRepository) {
        this.departmentRepo = departmentRepo;
    }

    async checkExistingDepartment(name: string): Promise<boolean> {
        const departmentData:DepartmentDoc | null = await this.departmentRepo.findDepartmentByName(name);
        return !!departmentData;
    }

    async addDepartment(data: IDepartmentData): Promise<Res | null> {
        try {
            const { name, title, description, logo, image } = data;
            if (!name || !title || !description || !logo || !image) {
                return { status: false, message: 'Missing required fields' };
            }

            const existingDepartment = await this.checkExistingDepartment(name);
            if (existingDepartment) return { status: false, message: "Department name already exists" };

            const logoPublicId = await uploadFile(logo, "department_logos");
            const imagePublicId = await uploadFile(image, "department_images");

            const departmentData = await this.departmentRepo.createDepartment(name, title, description, logoPublicId, imagePublicId);
            return { data: departmentData, status: true, message: "Department added successfully" };
        } catch (error) {
            console.error("Error in addDepartment:", error);
            return null;
        }
    }

    async listDepartment(isBlocked: boolean): Promise<Res | null> {
        try {
            const departmentData: DepartmentDoc[] | null = await this.departmentRepo.findDepartments();
            const filteredData: DepartmentDoc[] | undefined = departmentData?.filter(obj => obj.is_blocked === isBlocked);
            return { data: filteredData, status: true, message: 'Complete list of departments' };
        } catch (error) {
            console.error("Error in listDepartment:", error);
            return null;
        }
    }
}

export default DepartmentServices;
