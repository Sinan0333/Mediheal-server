import express,{Router} from 'express'
// import { adminAuthMiddleware } from '../middleware/adminAuthMiddleware'

import OtpRepository from '../repositories/otpRepositories'
import ScheduleRepository from '../repositories/scheduleRepository'

import UserController from '../controllers/userController'
import UserServices from '../services/userServices'
import UserRepository from '../repositories/userRepositories'

import DepartmentController from '../controllers/departmentController'
import DepartmentServices from '../services/departmentServices'
import DepartmentRepository from '../repositories/departmentRepositories'

import PatientController from '../controllers/patientController'
import PatientServices from '../services/patientServices'
import PatientRepository from '../repositories/patientRepositories'

import AdmitHistoryRepository from '../repositories/admitHistoryRepositories'
import AdmitHistoryServices from '../services/admitHistoryServices'
import AdmitHistoryController from '../controllers/admitHistoryController'

import BedRepository from '../repositories/bedRepositories'
import BedServices from '../services/bedServices'
import BedController from '../controllers/bedController'

import DoctorRepository from '../repositories/doctorRepositories' 
import DoctorServices from '../services/doctorServices'
import DoctorController from '../controllers/doctorController'

import AppointmentRepository from '../repositories/appointmentRepositories'
import AppointmentServices from '../services/appointmentServices'
import AppointmentController from '../controllers/appointmentController'

const adminRoute:Router = express.Router()
// adminRoute.use(adminAuthMiddleware)

const otpRepository = new OtpRepository()
const scheduleRepository = new ScheduleRepository()

const userRepository = new UserRepository()
const userServices = new UserServices(userRepository,otpRepository)
const userController = new UserController(userServices)

const departmentRepository = new DepartmentRepository()
const departmentServices = new DepartmentServices(departmentRepository)
const departmentController = new DepartmentController(departmentServices)

const patientRepository = new PatientRepository()
const patientServices = new PatientServices(patientRepository)
const patientController = new PatientController(patientServices)

const admitHistoryRepository = new AdmitHistoryRepository()
const admitHistoryServices = new AdmitHistoryServices(admitHistoryRepository)
const admitHistoryController = new AdmitHistoryController(admitHistoryServices)

const bedRepositories = new BedRepository()
const bedServices = new BedServices(bedRepositories,patientRepository,admitHistoryRepository)
const bedController = new BedController(bedServices)

const doctorRepositories = new DoctorRepository()
const doctorServices = new DoctorServices(doctorRepositories,scheduleRepository)
const doctorController = new DoctorController(doctorServices)

const appointmentRepositories = new AppointmentRepository()
const appointmentServices = new AppointmentServices(appointmentRepositories,scheduleRepository,userRepository)
const appointmentController = new AppointmentController(appointmentServices)

adminRoute.get('/user',userController.listUsers.bind(userController))
adminRoute.post('/user/view',userController.getUserData.bind(userController))
adminRoute.post('/user/block/:_id',userController.changeBlockStatus.bind(userController))
adminRoute.get('/user/count',userController.totalUsers.bind(userController))

adminRoute.get('/department',departmentController.listDepartment.bind(departmentController))
adminRoute.get('/department/view/:_id',departmentController.getDepartment.bind(departmentController))
adminRoute.get('/department/unblocked',departmentController.unBlockedDepartments.bind(departmentController))
adminRoute.post('/department/add',departmentController.addDepartment.bind(departmentController))
adminRoute.post('/department/edit/:_id',departmentController.editDepartment.bind(departmentController))
adminRoute.post('/department/block/:_id',departmentController.changeBlockStatus.bind(departmentController))
adminRoute.get('/department/count',departmentController.totalDepartments.bind(departmentController))

adminRoute.get('/patient',patientController.getPatients.bind(patientController))
adminRoute.get('/patient/view/:_id',patientController.getPatient.bind(patientController))
adminRoute.get('/patient/count',patientController.totalPatients.bind(patientController))

adminRoute.get('/admit_history',admitHistoryController.getAllAdmitHistory.bind(admitHistoryController))
adminRoute.get('/admit_history/view/:_id',admitHistoryController.getAdmitHistoryDetails.bind(admitHistoryController))
adminRoute.get('/admit_history/count',admitHistoryController.totalAdmits.bind(admitHistoryController))
adminRoute.get('/admit_history/revenue',admitHistoryController.getMonthlyRevenue.bind(admitHistoryController))

adminRoute.get('/bed',bedController.getAllBeds.bind(bedController))
adminRoute.post('/bed/add',bedController.addBed.bind(bedController))
adminRoute.get('/bed/view/:_id',bedController.getBedDetails.bind(bedController))
adminRoute.post('/bed/edit/:_id',bedController.updateBed.bind(bedController))
adminRoute.post('/bed/update/:_id',bedController.updateBedTypeAndCharge.bind(bedController))
adminRoute.post('/bed/block/:_id',bedController.changeBlockStatus.bind(bedController))
adminRoute.post('/bed/assign',bedController.assignPatient.bind(bedController))
adminRoute.put('/bed/discharge/:_id',bedController.dischargePatient.bind(bedController))
adminRoute.get('/bed/count',bedController.totalBeds.bind(bedController))
adminRoute.get('/bed/vacant_beds_count',bedController.totalVacantBeds.bind(bedController))

adminRoute.get('/doctor/list',doctorController.listDoctors.bind(doctorController))
adminRoute.post('/doctor/add',doctorController.addDoctor.bind(doctorController))
adminRoute.get('/doctor/view/:_id',doctorController.viewDoctor.bind(doctorController))
adminRoute.post('/doctor/edit/:_id',doctorController.ediDoctor.bind(doctorController))
adminRoute.post('/doctor/block/:_id',doctorController.changeBlockStatus.bind(doctorController))
adminRoute.get('/doctor/unblocked',doctorController.unBlockedDoctors.bind(doctorController))
adminRoute.get('/doctor/count',doctorController.totalDoctors.bind(doctorController))

adminRoute.get('/appointment/revenue',appointmentController.getMonthlyRevenue.bind(appointmentController))

export default adminRoute