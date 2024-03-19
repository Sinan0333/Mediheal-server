import express,{Router} from 'express'

import AdminController from '../controllers/adminController'
import AdminServices from '../services/adminServices'
import AdminRepository from '../repositories/adminRepositories'

import DepartmentController from '../controllers/departmentController'
import DepartmentServices from '../services/departmentServices'
import DepartmentRepository from '../repositories/departmentRepositories'


const adminRoute:Router = express.Router()


const adminRepository = new AdminRepository()
const adminServices = new AdminServices(adminRepository)
const adminController = new AdminController(adminServices)

const departmentRepository = new DepartmentRepository()
const departmentServices = new DepartmentServices(departmentRepository)
const departmentController = new DepartmentController(departmentServices)


adminRoute.post('/login',adminController.login.bind(adminController))
adminRoute.post('/department/add',departmentController.addDepartment.bind(departmentController))



export default adminRoute