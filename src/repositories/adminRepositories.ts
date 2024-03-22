import { UserDoc } from "../interfaces/IUser"
import Admin from "../models/adminModel"

class AdminRepository{

    async findAdminByEmail(email:string):Promise<UserDoc | null>{
        try {
            const userData =await Admin.findOne({email})
            return userData
        } catch (error) {
            console.error("Error in findAdminByEmail:", error);
            return null;
        }
    }
}

export default AdminRepository