import bcrypt from 'bcrypt';
import AdminRepository from "../repositories/adminRepositories";
import { UserDoc, UserRes } from '../interfaces/IUser';
import { generateToken } from '../utils/jwt';

class AdminServices {
    private adminRepo: AdminRepository;

    constructor(adminRepo: AdminRepository) {
        this.adminRepo = adminRepo;
    }

    async authAdmin(email: string, password: string): Promise<UserRes | null> {
        try {
            const userData: UserDoc | null = await this.adminRepo.findAdminByEmail(email);

            if (userData) {
                const isPasswordValid:Boolean = await bcrypt.compare(password, userData.password);

                if (isPasswordValid) {
                    const token: string = generateToken(userData._id);
                    return { userData, token, status: true, message: 'Authentication successful' };
                } else {
                    return { status: false, message: 'Incorrect password' };
                }
            } else {
                return { status: false, message: 'Email not found' };
            }
        } catch (error) {
            console.error("Error in authAdmin:", error);
            return null;
        }
    }
}

export default AdminServices;
