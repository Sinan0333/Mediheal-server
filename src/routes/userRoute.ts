import express,{Router} from 'express'

import OtpRepository from '../repositories/otpRepositories'

import UserController from '../controllers/userController'
import UserServices from '../services/userServices'
import UserRepository from '../repositories/userRepositories'

import PatientController from '../controllers/patientController'
import PatientServices from '../services/patientServices'
import PatientRepository from '../repositories/patientRepositories'

import AppointmentController from '../controllers/appointmentController'
import AppointmentServices from '../services/appointmentServices'
import AppointmentRepository from '../repositories/appointmentRepositories'


const userRoute:Router = express.Router()

const otpRepository = new OtpRepository()

const userRepository = new UserRepository()
const userServices = new UserServices(userRepository,otpRepository)
const userController = new UserController(userServices)

const patientRepository = new PatientRepository()
const patientServices = new PatientServices(patientRepository)
const patientController = new PatientController(patientServices)

const appointmentRepository = new AppointmentRepository()
const appointmentServices = new AppointmentServices(appointmentRepository)
const appointmentController = new AppointmentController(appointmentServices)


userRoute.post('/signup',userController.signup.bind(userController))
userRoute.post('/get_otp',userController.getOtp.bind(userController))
userRoute.post('/verify',userController.verifyOtp.bind(userController))
userRoute.post('/login',userController.login.bind(userController))
userRoute.get('/list',userController.listUsers.bind(userController))
userRoute.post('/list/view',userController.getUserData.bind(userController))
userRoute.post('/list/edit',userController.updateProfile.bind(userController))
userRoute.post('/list/block/:_id',userController.changeBlockStatus.bind(userController))
userRoute.post('/patient/add',patientController.addPatient.bind(patientController))
userRoute.get('/patient/:userId',patientController.getUserPatients.bind(patientController))
userRoute.post('/patient/book',appointmentController.createAppointment.bind(appointmentController))
userRoute.get('/appointment/:_id',appointmentController.getAppointmentData.bind(appointmentController))


export default userRoute