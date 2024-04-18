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

import ScheduleRepository from '../repositories/scheduleRepository'


const userRoute:Router = express.Router()

const otpRepository = new OtpRepository()

const userRepository = new UserRepository()
const userServices = new UserServices(userRepository,otpRepository)
const userController = new UserController(userServices)

const patientRepository = new PatientRepository()
const patientServices = new PatientServices(patientRepository)
const patientController = new PatientController(patientServices)

const scheduleRepository = new ScheduleRepository()

const appointmentRepository = new AppointmentRepository()
const appointmentServices = new AppointmentServices(appointmentRepository,scheduleRepository,userRepository)
const appointmentController = new AppointmentController(appointmentServices)


userRoute.post('/signup',userController.signup.bind(userController))
userRoute.get('/get_otp/:_id',userController.getOtp.bind(userController))
userRoute.get('/resend_otp/:_id',userController.resendOtp.bind(userController))
userRoute.post('/verify',userController.verifyOtp.bind(userController))
userRoute.post('/login',userController.login.bind(userController))

userRoute.get('/list',userController.listUsers.bind(userController))
userRoute.post('/list/view',userController.getUserData.bind(userController))
userRoute.post('/list/edit',userController.updateProfile.bind(userController))
userRoute.post('/list/block/:_id',userController.changeBlockStatus.bind(userController))

userRoute.get('/patient',patientController.getPatients.bind(patientController))
userRoute.post('/patient/add',patientController.addPatient.bind(patientController))
userRoute.get('/patient/:userId',patientController.getUserPatients.bind(patientController))
userRoute.get('/patient/view/:_id',patientController.getPatient.bind(patientController))

userRoute.get('/appointment/:_id',appointmentController.getAppointmentData.bind(appointmentController))
userRoute.post("/appointment/create-checkout-session",userController.createCheckoutSession.bind(userController))
userRoute.post("/appointment/confirm_booking/:scheduleId",appointmentController.confirmBooking.bind(appointmentController))
userRoute.get("/appointment/history/:userId",appointmentController.userAppointmentHistory.bind(appointmentController))
userRoute.post("/appointment/cancel/:_id",appointmentController.cancelBooking.bind(appointmentController))
userRoute.get("/appointment/cancel_when_break/:_id",appointmentController.cancelBookingWhenBreak.bind(appointmentController))


export default userRoute