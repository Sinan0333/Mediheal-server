import { UserDoc } from "../interfaces/IUser";
import User from "../models/userModel";

class UserRepository {

    async findUserByEmail(email: string): Promise<UserDoc | null> {
        try {
            const userData:UserDoc | null = await User.findOne({ email }).exec();
            return userData;
        } catch (error) {
            console.error("Error in findUserByEmail:", error);
            return null;
        }
    }

    async findUserById(_id: string): Promise<UserDoc | null> {
        try {
            const userData:UserDoc | null = await User.findOne({ _id }).exec();
            return userData;
        } catch (error) {
            console.error("Error in findUserById:", error);
            return null;
        }
    }

    async createUser(name: string, phone: string, email: string, password: string): Promise<UserDoc> {
        try {
            const userModel = new User({ name, phone, email, password });
            return await userModel.save();
        } catch (error) {
            console.error("Error in createUser:", error);
            throw error;
        }
    }

    async findUserByIdAndUpdate(_id:string | undefined,data:object): Promise<UserDoc | null > {
        try {
            const userData:UserDoc | null = await User.findByIdAndUpdate({_id},data,{new:true});
            return userData
        } catch (error) {
            console.error("Error in findUserByIdAndUpdate:", error);
            throw error;
        }
    }

    async findUsers(): Promise<UserDoc[] | null > {
        try {
            const userData:UserDoc[] = await User.find();
            return userData
        } catch (error) {
            console.error("Error in findUserByIdAndUpdate:", error);
            throw error;
        }
    }
}

export default UserRepository;
