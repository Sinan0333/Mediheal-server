import express,{Router} from 'express'
// import { userAuthMiddleware } from '../middleware/userAuthMiddleware'

import OtpRepository from '../repositories/otpRepositories'
import ScheduleRepository from '../repositories/scheduleRepository'

import UserController from '../controllers/userController'
import UserServices from '../services/userServices'
import UserRepository from '../repositories/userRepositories'

import PatientController from '../controllers/patientController'
import PatientServices from '../services/patientServices'
import PatientRepository from '../repositories/patientRepositories'

import DepartmentController from '../controllers/departmentController'
import DepartmentServices from '../services/departmentServices'
import DepartmentRepository from '../repositories/departmentRepositories'

import DoctorRepository from '../repositories/doctorRepositories' 
import DoctorServices from '../services/doctorServices'
import DoctorController from '../controllers/doctorController'

import AppointmentController from '../controllers/appointmentController'
import AppointmentServices from '../services/appointmentServices'
import AppointmentRepository from '../repositories/appointmentRepositories'

const userRoute:Router = express.Router()
// userRoute.use(userAuthMiddleware)

const otpRepository = new OtpRepository()
const scheduleRepository = new ScheduleRepository()

const userRepository = new UserRepository()
const userServices = new UserServices(userRepository,otpRepository)
const userController = new UserController(userServices)

const patientRepository = new PatientRepository()
const patientServices = new PatientServices(patientRepository)
const patientController = new PatientController(patientServices)

const departmentRepository = new DepartmentRepository()
const departmentServices = new DepartmentServices(departmentRepository)
const departmentController = new DepartmentController(departmentServices)

const doctorRepositories = new DoctorRepository()
const doctorServices = new DoctorServices(doctorRepositories,scheduleRepository)
const doctorController = new DoctorController(doctorServices)

const appointmentRepository = new AppointmentRepository()
const appointmentServices = new AppointmentServices(appointmentRepository,scheduleRepository,userRepository)
const appointmentController = new AppointmentController(appointmentServices)

userRoute.post('/profile',userController.getUserData.bind(userController))
userRoute.post('/edit_profile',userController.updateProfile.bind(userController))

userRoute.post('/patient/add',patientController.addPatient.bind(patientController))
userRoute.get('/patient/:userId',patientController.getUserPatients.bind(patientController))

userRoute.get('/department/unblocked',departmentController.unBlockedDepartments.bind(departmentController))

userRoute.get('/list/unblocked',doctorController.unBlockedDoctors.bind(doctorController))
userRoute.get('/view/:_id',doctorController.viewDoctor.bind(doctorController))
userRoute.get('/list/best',doctorController.getBestDoctors.bind(doctorController))

userRoute.post("/appointment/create-checkout-session",userController.createCheckoutSession.bind(userController))
userRoute.post("/appointment/confirm_booking/:scheduleId",appointmentController.confirmBooking.bind(appointmentController))
userRoute.get("/appointment/history/:userId",appointmentController.userAppointmentHistory.bind(appointmentController))
userRoute.post("/appointment/cancel/:_id",appointmentController.cancelBooking.bind(appointmentController))

export default userRoute