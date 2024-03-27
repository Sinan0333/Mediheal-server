import express,{Router} from 'express'

import UserController from '../controllers/userController'
import UserServices from '../services/userServices'
import UserRepository from '../repositories/userRepositories'
import OtpRepository from '../repositories/otpRepositories'


const userRoute:Router = express.Router()

const otpRepository = new OtpRepository()

const userRepository = new UserRepository()
const userServices = new UserServices(userRepository,otpRepository)
const userController = new UserController(userServices)


userRoute.post('/signup',userController.signup.bind(userController))
userRoute.post('/get_otp',userController.getOtp.bind(userController))
userRoute.post('/verify',userController.verifyOtp.bind(userController))
userRoute.post('/login',userController.login.bind(userController))
userRoute.get('/list',userController.listUsers.bind(userController))
userRoute.post('/list/view',userController.getUserData.bind(userController))
userRoute.post('/list/edit',userController.updateProfile.bind(userController))



export default userRoute