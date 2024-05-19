import { Types } from "mongoose";
import { History, UserDoc } from "../interfaces/IUser";
import User from "../models/userModel";
import { FilterCondition } from "../interfaces/Icommon";

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

    async createUser(name: string, phone: string, email: string, password: string,verified?:boolean): Promise<UserDoc> {
        try {
            const userModel = new User({ name, phone, email, password,verified });
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

    async findUsers(filterCondition:FilterCondition): Promise<UserDoc[] | [] > {
        try {

            const query:any = {}
            const skip:number = (filterCondition.page - 1) * 13

            if(filterCondition.search && filterCondition.search !== "default" && filterCondition.search !== "null"){
                const regex = new RegExp (`^${filterCondition.search}`, 'i')
                query.name = {$regex: regex}
            }

            const userData:UserDoc[] = await User.find(query).skip(skip).limit(13);
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

    async updateHistory(_id:Types.ObjectId | string,data:History): Promise<UserDoc | null > {
        try {
            const userData:UserDoc | null = await User.findOneAndUpdate({_id},{$push:{history:data},$inc:{wallet:data.amount}},{new:true});
            return userData
        } catch (error) {
            console.error("Error in findUserByIdAndUpdate:", error);
            throw error;
        }
    }

    async countDocuments(filterCondition:FilterCondition): Promise<Number> {
        try {

            const query:any = {}
            if(filterCondition.search && filterCondition.search !== "default" && filterCondition.search !== "null"){
                const regex = new RegExp (`^${filterCondition.search}`, 'i')
                query.name = {$regex: regex}
            }

            const count:Number  = await User.countDocuments(query).exec();
            return count;
        } catch (error) {
            console.error("Error in countDocuments:", error);
            throw error;
        }
    }
}

export default UserRepository;
