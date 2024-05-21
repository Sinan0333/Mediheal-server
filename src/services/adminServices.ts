import bcrypt from 'bcrypt';
import AdminRepository from "../repositories/adminRepositories";
import { UserDoc, UserRes } from '../interfaces/IUser';
import { generateRefreshToken, generateToken, verifyToken } from '../utils/jwt';
import { Res } from '../interfaces/Icommon';

class AdminServices {
    private adminRepo: AdminRepository;

    constructor(adminRepo: AdminRepository) {
        this.adminRepo = adminRepo;
    }

    async authAdmin(email: string, password: string): Promise<UserRes > {
        try {
            const userData: UserDoc | null = await this.adminRepo.findAdminByEmail(email);

            if (userData) {
                const isPasswordValid:Boolean = await bcrypt.compare(password, userData.password);

                if (isPasswordValid) {
                    const token: string = generateToken(userData);
                    const refreshToken:string = generateRefreshToken(userData)
                    return { userData, token,refreshToken, status: true, message: 'Authentication successful' };
                } else {
                    return { status: false, message: 'Incorrect password' };
                }
            } else {
                return { status: false, message: 'Email not found' };
            }
        } catch (error) {
            console.error("Error in authAdmin:", error);
            throw error;
        }
    }

    async refreshToken(token:string): Promise<Res> {
        try {

           const decodedToken = verifyToken(token);
           const userData:UserDoc | null = await this.adminRepo.findAdminByEmail(decodedToken.email)

           if(!userData) return {status:false,message:"Cant find the user"}
           const accessToken:string = generateToken(userData)
           const refreshToken:string = generateRefreshToken(userData)

            return {status:true ,data:{accessToken,refreshToken} ,message:"Token refreshed"}

        } catch (error) {
            console.error("Error in refreshToken:", error);
            throw error;
        }
    }

    async adminProfile(_id:string): Promise<Res> {
        try {
        
           const userData:UserDoc | null = await this.adminRepo.findAdminById(_id)
           if(!userData) return {status:false,message:"Cant find the user"}
            return {status:true ,data:userData ,message:"Token refreshed"}

        } catch (error) {
            console.error("Error in adminProfile:", error);
            throw error;
        }
    }
}

export default AdminServices;
