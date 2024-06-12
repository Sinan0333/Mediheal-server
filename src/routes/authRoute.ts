import express,{Router} from 'express'

import UserController from '../controllers/userController'
import UserServices from '../services/userServices'
import UserRepository from '../repositories/userRepositories'
import OtpRepository from '../repositories/otpRepositories'

import DoctorRepository from '../repositories/doctorRepositories' 
import DoctorServices from '../services/doctorServices'
import DoctorController from '../controllers/doctorController'
import ScheduleRepository from '../repositories/scheduleRepository'

import AdminController from '../controllers/adminController'
import AdminServices from '../services/adminServices'
import AdminRepository from '../repositories/adminRepositories'


const authRoute:Router = express.Router()

const otpRepository = new OtpRepository()
const userRepository = new UserRepository()
const userServices = new UserServices(userRepository,otpRepository)
const userController = new UserController(userServices)

const scheduleRepository = new ScheduleRepository()
const doctorRepositories = new DoctorRepository()
const doctorServices = new DoctorServices(doctorRepositories,scheduleRepository,otpRepository)
const doctorController = new DoctorController(doctorServices)

const adminRepository = new AdminRepository()
const adminServices = new AdminServices(adminRepository,otpRepository)
const adminController = new AdminController(adminServices)

authRoute.post('/user/signup',userController.signup.bind(userController))
authRoute.post('/user/google_auth',userController.googleAuth.bind(userController))
authRoute.get('/user/get_otp/:_id',userController.getOtp.bind(userController))
authRoute.get('/user/resend_otp/:_id',userController.resendOtp.bind(userController))
authRoute.post('/user/verify',userController.verifyOtp.bind(userController))
authRoute.post('/user/login',userController.login.bind(userController))
authRoute.post('/user/refresh',userController.refreshToken.bind(userController))
authRoute.put('/user/verify_email',userController.verifyEmail.bind(userController))
authRoute.patch('/user/change_password',userController.changePassword.bind(userController))

authRoute.post('/doctor/login',doctorController.login.bind(doctorController))
authRoute.post('/doctor/refresh',doctorController.refreshToken.bind(doctorController))
authRoute.put('/doctor/verify_email',doctorController.verifyEmail.bind(doctorController))
authRoute.get('/doctor/get_otp/:_id',doctorController.getOtp.bind(doctorController))
authRoute.post('/doctor/verify',doctorController.verifyOtp.bind(doctorController))
authRoute.patch('/doctor/change_password',doctorController.changePassword.bind(doctorController))
authRoute.get('/doctor/resend_otp/:_id',doctorController.resendOtp.bind(doctorController))

authRoute.post('/admin/login',adminController.login.bind(adminController))
authRoute.post('/admin/refresh',adminController.refreshToken.bind(adminController))
authRoute.put('/admin/verify_email',adminController.verifyEmail.bind(adminController))
authRoute.get('/admin/get_otp/:_id',adminController.getOtp.bind(adminController))
authRoute.post('/admin/verify',adminController.verifyOtp.bind(adminController))
authRoute.patch('/admin/change_password',adminController.changePassword.bind(adminController))
authRoute.get('/admin/resend_otp/:_id',adminController.resendOtp.bind(adminController))


export default authRoute