import bcrypt from 'bcrypt'
import adminRepositories from "../repositories/adminRepositories";
import { UserData, UserRes } from '../interfaces/IUser';
import { generateToken } from '../utils/jwt';



class AdminServices{
    private adminRepo:adminRepositories
    
    constructor(adminRepo:adminRepositories){
        this.adminRepo = adminRepo
    }

    async authAdmin(email:string,password:string):Promise<UserRes | null>{
        try {

            const userData:UserData|null = await this.adminRepo.findAdminByEmail(email)

        if(userData){
            const isPasswordValid = await bcrypt.compare(password,userData.password)

            if(isPasswordValid){

                const token:string = generateToken(userData._id)
                return {userData,token,status:true,message:'Success'}

            }else{
                return {status:false,message:'incorrect password'}
            }
        }else{
            return {status:false,message:'Email not found'}
        }
        } catch (error) {
            console.error("Error in authAdmin:", error);
            return null
        }
    }

}

export  default AdminServices