import express,{Router} from 'express'

import UserController from '../controllers/userController'
import UserServices from '../services/userServices'
import UserRepository from '../repositories/userRepositories'


const userRoute:Router = express.Router()


const userRepository = new UserRepository()
const userServices = new UserServices(userRepository)
const userController = new UserController(userServices)





userRoute.post('/signup',userController.signup.bind(userController))
userRoute.post('/login',userController.login.bind(userController))



export default userRoute