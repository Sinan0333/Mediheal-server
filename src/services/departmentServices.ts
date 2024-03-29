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

            const existingDepartment:Boolean = await this.checkExistingDepartment(name);
            if (existingDepartment) return { status: false, message: "Department name already exists" };

            const logoPublicId:string = await uploadFile(logo, "department_logos");
            const imagePublicId:string = await uploadFile(image, "department_images");

            const departmentData:DepartmentDoc | null = await this.departmentRepo.createDepartment(name, title, description, logoPublicId, imagePublicId);
            return { data: departmentData, status: true, message: "Department added successfully" };
        } catch (error) {
            console.error("Error in addDepartment:", error);
            return null;
        }
    }

    async editDepartment(_id:string,data: IDepartmentData): Promise<Res | null> {
        try {
            const { name, title, description, logo, image } = data;
            if (!name || !title || !description || !logo || !image) {
                return { status: false, message: 'Missing required fields' };
            }

            let logoPublicId:string
            if(data.image.split("/").includes('Mediheal')){
                logoPublicId=data.image
            }else{
                logoPublicId = await uploadFile(data.logo,"department_logos");
            }

            let imagePublicId:string
            if(data.image.split("/").includes('Mediheal')){
                imagePublicId=data.image
            }else{
                imagePublicId = await uploadFile(data.image,"department_images");
            }

            const departmentData:DepartmentDoc | null = await this.departmentRepo.updateDepartment(_id,name, title, description, logoPublicId, imagePublicId);
            return { data: departmentData, status: true, message: "Department updated successfully" };
        } catch (error) {
            console.error("Error in addDepartment:", error);
            return null;
        }
    }

    async getDepartmentData(_id:string): Promise<Res | null> {
        try {
            const departmentData:DepartmentDoc | null = await this.departmentRepo.findDepartmentById(_id)
            return { data: departmentData, status: true, message: 'Departments Data' };
        } catch (error) {
            console.error("Error in listDepartment:", error);
            return null;
        }
    }

    async listDepartment(isBlocked?: boolean): Promise<Res | null> {
        try {
            const departmentData: DepartmentDoc[] | null = await this.departmentRepo.findDepartments();
            if(isBlocked !==undefined){
                const filteredData: DepartmentDoc[] | undefined = departmentData?.filter(obj => obj.is_blocked === isBlocked);
                return { data: filteredData, status: true, message: 'Complete list of departments' };
            }

            return { data: departmentData, status: true, message: 'Complete list of departments' };
        } catch (error) {
            console.error("Error in listDepartment:", error);
            return null;
        }
    }

    async changeBlockStatus(_id:string,is_blocked:Boolean): Promise<Res | null> {
        try {

            const doctorData:DepartmentDoc | null = await this.departmentRepo.changeBlockStatus(_id,is_blocked)
            return {data:doctorData,status:true,message:`Department is ${is_blocked ? "blocked" : "unblocked"}`}
            
        } catch (error) {
            console.error("Error in editDoctor:", error);
            return null;
        }
    }
}

export default DepartmentServices;
