import { UserData } from "../interfaces/IUser"
import User from "../models/userModel"

class UserRepository{

    async findUserByEmail(email:string):Promise<UserData | null>{
        const userData = User.findOne({email:email}).exec()
        return userData
    }

    async createUser(name:string,phone:string,email:string,password:string):Promise<UserData>{
        const userModel = new User({name,phone,email,password})
        return await userModel.save()
    }
}

export default UserRepository