import { UserDoc } from "../interfaces/IUser"
import Admin from "../models/adminModel"

class AdminRepository{

    async findAdminByEmail(email:string):Promise<UserDoc | null>{
        try {
            const userData:UserDoc | null =await Admin.findOne({email})
            return userData
        } catch (error) {
            console.error("Error in findAdminByEmail:", error);
            throw error;
        }
    }

    async findAdminById(_id:string ):Promise<UserDoc | null>{
        try {
            const userData:UserDoc | null =await Admin.findOne({_id})
            return userData
        } catch (error) {
            console.error("Error in findAdminById:", error);
            throw error;
        }
    }

    async findAdminAndUpdate(_id:string,data:UserDoc ):Promise<UserDoc | null>{
        try {
            const userData:UserDoc | null =await Admin.findOneAndUpdate({_id},data)
            return userData
        } catch (error) {
            console.error("Error in findAdminAndUpdate:", error);
            throw error;
        }
    }
}

export default AdminRepository