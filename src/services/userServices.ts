import bcrypt from 'bcrypt'

import userRepositories from "../repositories/userRepositories";
import { UserData,ResErr } from '../interfaces/IUser';




class UserServices{
    private userRepo:userRepositories
    
    constructor(userRepo:userRepositories){
        this.userRepo = userRepo
    }

    async checkExistingEmail(email:string):Promise<boolean>{
        const userData = await this.userRepo.findUserByEmail(email)
        return userData? true : false
    }

    async createUser(name:string,phone:string,email:string,password:string):Promise<UserData | ResErr>{
        const hashedPass:string = await bcrypt.hash(password,10)
        const checkEmail:boolean = await this.checkExistingEmail(email)
        if(checkEmail){
            return {error:"Email is already exist"}
        }
        const userData = await this.userRepo.createUser(name,phone,email,hashedPass)
        return userData
    }

    async authUser(email:string,password:string):Promise<UserData | ResErr>{
        const userData = await this.userRepo.findUserByEmail(email)
        if(userData){
            const isPasswordValid = await bcrypt.compare(password,userData.password)
            if(isPasswordValid){
                return userData
            }else{
                return {error:"incorrect password"}
            }
        }else{
            return {error:"Email is not found"}
        }
    }

}

export  default UserServices