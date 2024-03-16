import { UserData } from "../interfaces/IUser"
import Admin from "../models/adminModel"

class AdminRepository{

    async findAdminByEmail(email:string):Promise<UserData | null>{
        const userData = Admin.findOne({email:email}).exec()
        return userData
    }
}

export default AdminRepository