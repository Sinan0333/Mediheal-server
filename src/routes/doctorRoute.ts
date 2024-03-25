import express,{Router} from 'express'

import DoctorRepository from '../repositories/doctorRepositories' 
import DoctorServices from '../services/doctorServices'
import DoctorController from '../controllers/doctorController'


const doctorRepositories = new DoctorRepository()
const doctorServices = new DoctorServices(doctorRepositories)
const doctorController = new DoctorController(doctorServices)


const doctorRoute:Router = express.Router()


doctorRoute.post('/login',doctorController.login.bind(doctorController))
doctorRoute.post('/add',doctorController.addDoctor.bind(doctorController))
doctorRoute.get('/view/:_id',doctorController.viewDoctor.bind(doctorController))
doctorRoute.post('/edit/:_id',doctorController.ediDoctor.bind(doctorController))
doctorRoute.get('/list',doctorController.listDoctors.bind(doctorController))

export default doctorRoute