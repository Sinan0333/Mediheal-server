import express,{Router} from 'express'

import AdminController from '../controllers/adminController'
import AdminServices from '../services/adminServices'
import AdminRepository from '../repositories/adminRepositories'


const adminRoute:Router = express.Router()


const adminRepository = new AdminRepository()
const adminServices = new AdminServices(adminRepository)
const adminController = new AdminController(adminServices)





adminRoute.post('/login',adminController.login.bind(adminController))



export default adminRoute