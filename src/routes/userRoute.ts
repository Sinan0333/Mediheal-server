import express,{Router} from 'express'

import OtpRepository from '../repositories/otpRepositories'

import UserController from '../controllers/userController'
import UserServices from '../services/userServices'
import UserRepository from '../repositories/userRepositories'

import PatientController from '../controllers/patientController'
import PatientServices from '../services/patientServices'
import PatientRepository from '../repositories/patientRepositories'


const userRoute:Router = express.Router()

const otpRepository = new OtpRepository()

const userRepository = new UserRepository()
const userServices = new UserServices(userRepository,otpRepository)
const userController = new UserController(userServices)

const patientRepository = new PatientRepository()
const patientServices = new PatientServices(patientRepository)
const patientController = new PatientController(patientServices)


userRoute.post('/signup',userController.signup.bind(userController))
userRoute.post('/get_otp',userController.getOtp.bind(userController))
userRoute.post('/verify',userController.verifyOtp.bind(userController))
userRoute.post('/login',userController.login.bind(userController))
userRoute.get('/list',userController.listUsers.bind(userController))
userRoute.post('/list/view',userController.getUserData.bind(userController))
userRoute.post('/list/edit',userController.updateProfile.bind(userController))
userRoute.post('/list/block/:_id',userController.changeBlockStatus.bind(userController))
userRoute.post('/patient/add',patientController.addPatient.bind(patientController))


export default userRoute