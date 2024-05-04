import { Types } from "mongoose";
import { History, UserDoc } from "../interfaces/IUser";
import User from "../models/userModel";

class UserRepository {

    async findUserByEmail(email: string): Promise<UserDoc | null> {
        try {
            const userData:UserDoc | null = await User.findOne({ email }).exec();
            return userData;
        } catch (error) {
            console.error("Error in findUserByEmail:", error);
            throw error;
        }
    }

    async findUserById(_id: string): Promise<UserDoc | null> {
        try {
            const userData:UserDoc | null = await User.findOne({ _id }).exec();
            return userData;
        } catch (error) {
            console.error("Error in findUserById:", error);
            throw error;
        }
    }

    async createUser(name: string, phone: string, email: string, password: string): Promise<UserDoc> {
        try {
            const userModel = new User({ name, phone, email, password });
            return await userModel.save();
        } catch (error) {
            console.error("Error in createUser:", error);
            throw error
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

    async findUsers(): Promise<UserDoc[] | [] > {
        try {
            const userData:UserDoc[] = await User.find();
            return userData
        } catch (error) {
            console.error("Error in findUsers:", error);
            throw error
        }
    }

    async changeBlockStatus(_id:string,is_blocked:Boolean):Promise<UserDoc | null>{
        try {
            const doctorData:UserDoc | null = await User.findOneAndUpdate({_id},{is_blocked:is_blocked},{new:true})
            return doctorData
        } catch (error) {
            console.error("Error changeBlockStatus:", error);
            throw error;
        }
    }

    async updateHistory(_id:Types.ObjectId,data:History): Promise<UserDoc | null > {
        try {
            const userData:UserDoc | null = await User.findOneAndUpdate({_id},{$push:{history:data},$inc:{wallet:data.amount}},{new:true});
            return userData
        } catch (error) {
            console.error("Error in findUserByIdAndUpdate:", error);
            throw error;
        }
    }

    async countDocuments(): Promise<Number> {
        try {
            const count:Number  = await User.countDocuments().exec();
            return count;
        } catch (error) {
            console.error("Error in countDocuments:", error);
            throw error;
        }
    }
}

export default UserRepository;
