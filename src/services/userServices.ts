import bcrypt from 'bcrypt'

import userRepositories from "../repositories/userRepositories";
import { UserRes } from '../interfaces/IUser';
import { generateToken } from '../utils/jwt';



class UserServices{
    private userRepo:userRepositories
    
    constructor(userRepo:userRepositories){
        this.userRepo = userRepo
    }

    async checkExistingEmail(email:string):Promise<boolean>{
        const userData = await this.userRepo.findUserByEmail(email)
        return userData? true : false
    }

    async createUser(name:string,phone:string | number,email:string,password:string):Promise<UserRes |null>{
       try {
         
        if (!name || !phone || !email || !password) return {status:false,message:'Missing required fields'}

        const hashedPass:string = await bcrypt.hash(password,10)
        const checkEmail:boolean = await this.checkExistingEmail(email)
        if(checkEmail) return {status:false,message:'Email is already exist'}
            
        if(typeof(phone) ==="string"){
            phone = parseInt(phone)
            const userData = await this.userRepo.createUser(name,phone,email,hashedPass)
            return {userData,status:true,message:'Success'}
        }else{
            return {status:false,message:'Internal server error'}
        }

       } catch (error) {
        console.log("Error in creatUser:",error)
        return null
       }
        
    }

    async authUser(email:string,password:string):Promise<UserRes | null>{
       try {
        const userData = await this.userRepo.findUserByEmail(email)
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
        console.log("Error in authUser:",error);
        return null
       }
    }

}

export  default UserServices