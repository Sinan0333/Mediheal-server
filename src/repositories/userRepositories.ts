import { UserDoc } from "../interfaces/IUser";
import User from "../models/userModel";

class UserRepository {

    async findUserByEmail(email: string): Promise<UserDoc | null> {
        try {
            const userData = await User.findOne({ email }).exec();
            return userData;
        } catch (error) {
            console.error("Error in findUserByEmail:", error);
            return null;
        }
    }

    async createUser(name: string, phone: number, email: string, password: string): Promise<UserDoc> {
        try {
            const userModel = new User({ name, phone, email, password });
            return await userModel.save();
        } catch (error) {
            console.error("Error in createUser:", error);
            throw error;
        }
    }
}

export default UserRepository;
