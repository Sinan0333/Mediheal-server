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

const adminRoute:Router = express.Router()


const adminRepository = new AdminRepository()
const adminServices = new AdminServices(adminRepository)
const adminController = new AdminController(adminServices)

const departmentRepository = new DepartmentRepository()
const departmentServices = new DepartmentServices(departmentRepository)
const departmentController = new DepartmentController(departmentServices)

const bedRepositories = new BedRepository()
const bedServices = new BedServices(bedRepositories)
const bedController = new BedController(bedServices)


adminRoute.post('/login',adminController.login.bind(adminController))
adminRoute.get('/department',departmentController.listDepartment.bind(departmentController))
adminRoute.get('/department/view/:_id',departmentController.getDepartment.bind(departmentController))
adminRoute.get('/department/unblocked',departmentController.unBlockedDepartments.bind(departmentController))
adminRoute.post('/department/add',departmentController.addDepartment.bind(departmentController))
adminRoute.post('/department/edit/:_id',departmentController.editDepartment.bind(departmentController))
adminRoute.post('/department/block/:_id',departmentController.changeBlockStatus.bind(departmentController))
adminRoute.post('/bed/add',bedController.addBed.bind(bedController))



export default adminRoute