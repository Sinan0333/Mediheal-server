import express,{Router} from 'express'

import DoctorRepository from '../repositories/doctorRepositories' 
import DoctorServices from '../services/doctorServices'
import DoctorController from '../controllers/doctorController'

import ScheduleRepository from '../repositories/scheduleRepository'

import AppointmentRepository from '../repositories/appointmentRepositories'
import AppointmentServices from '../services/appointmentServices'
import AppointmentController from '../controllers/appointmentController'

import UserRepository from '../repositories/userRepositories'

const scheduleRepository = new ScheduleRepository()
const doctorRepositories = new DoctorRepository()
const doctorServices = new DoctorServices(doctorRepositories,scheduleRepository)
const doctorController = new DoctorController(doctorServices)

const userRepositories = new UserRepository()

const appointmentRepositories = new AppointmentRepository()
const appointmentServices = new AppointmentServices(appointmentRepositories,scheduleRepository,userRepositories)
const appointmentController = new AppointmentController(appointmentServices)


const doctorRoute:Router = express.Router()


doctorRoute.post('/login',doctorController.login.bind(doctorController))
doctorRoute.post('/add',doctorController.addDoctor.bind(doctorController))
doctorRoute.get('/view/:_id',doctorController.viewDoctor.bind(doctorController))
doctorRoute.post('/edit/:_id',doctorController.ediDoctor.bind(doctorController))
doctorRoute.get('/list',doctorController.listDoctors.bind(doctorController))
doctorRoute.get('/list/best',doctorController.getBestDoctors.bind(doctorController))
doctorRoute.get('/list/unblocked',doctorController.unBlockedDoctors.bind(doctorController))
doctorRoute.post('/block/:_id',doctorController.changeBlockStatus.bind(doctorController))
doctorRoute.get('/appointment/list/:_id',appointmentController.getDoctorAppointments.bind(appointmentController))
doctorRoute.post('/take_break/:scheduleId',doctorController.takeABreak.bind(doctorController))


export default doctorRoute