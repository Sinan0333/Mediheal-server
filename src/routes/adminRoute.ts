import express,{Router} from 'express'

import AdminController from '../controllers/adminController'
import AdminServices from '../services/adminServices'
import AdminRepository from '../repositories/adminRepositories'

import DepartmentController from '../controllers/departmentController'
import DepartmentServices from '../services/departmentServices'
import DepartmentRepository from '../repositories/departmentRepositories'

import BedRepository from '../repositories/bedRepositories'
import BedServices from '../services/bedServices'
import BedController from '../controllers/bedController'

import PatientRepository from '../repositories/patientRepositories'

const adminRoute:Router = express.Router()


const adminRepository = new AdminRepository()
const adminServices = new AdminServices(adminRepository)
const adminController = new AdminController(adminServices)

const departmentRepository = new DepartmentRepository()
const departmentServices = new DepartmentServices(departmentRepository)
const departmentController = new DepartmentController(departmentServices)

const patientRepositories = new PatientRepository()

const bedRepositories = new BedRepository()
const bedServices = new BedServices(bedRepositories,patientRepositories)
const bedController = new BedController(bedServices)


adminRoute.post('/login',adminController.login.bind(adminController))
adminRoute.get('/department',departmentController.listDepartment.bind(departmentController))
adminRoute.get('/department/view/:_id',departmentController.getDepartment.bind(departmentController))
adminRoute.get('/department/unblocked',departmentController.unBlockedDepartments.bind(departmentController))
adminRoute.post('/department/add',departmentController.addDepartment.bind(departmentController))
adminRoute.post('/department/edit/:_id',departmentController.editDepartment.bind(departmentController))
adminRoute.post('/department/block/:_id',departmentController.changeBlockStatus.bind(departmentController))
adminRoute.get('/bed',bedController.getAllBeds.bind(bedController))
adminRoute.post('/bed/add',bedController.addBed.bind(bedController))
adminRoute.get('/bed/view/:_id',bedController.getBedDetails.bind(bedController))
adminRoute.post('/bed/block/:_id',bedController.changeBlockStatus.bind(bedController))
adminRoute.post('/bed/assign',bedController.assignPatient.bind(bedController))



export default adminRoute