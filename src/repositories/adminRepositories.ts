import { UserData } from "../interfaces/IUser"
import Admin from "../models/adminModel"

class AdminRepository{

    async findAdminByEmail(email:string):Promise<UserData | null>{
        try {
            const userData =await Admin.findOne({email}).exec()
            return userData
        } catch (error) {
            console.error("Error in findAdminByEmail:", error);
            return null;
        }
    }
}

export default AdminRepository