import express,{Router} from 'express'
import { doctorAuthMiddleware } from '../middleware/doctorAuthMiddleware'

import ScheduleRepository from '../repositories/scheduleRepository'
import UserRepository from '../repositories/userRepositories'

import DoctorRepository from '../repositories/doctorRepositories' 
import DoctorServices from '../services/doctorServices'
import DoctorController from '../controllers/doctorController'

import AppointmentRepository from '../repositories/appointmentRepositories'
import AppointmentServices from '../services/appointmentServices'
import AppointmentController from '../controllers/appointmentController'

import PatientController from '../controllers/patientController'
import PatientServices from '../services/patientServices'
import PatientRepository from '../repositories/patientRepositories'

const doctorRoute:Router = express.Router()
doctorRoute.use(doctorAuthMiddleware)

const scheduleRepository = new ScheduleRepository()
const userRepositories = new UserRepository()

const doctorRepositories = new DoctorRepository()
const doctorServices = new DoctorServices(doctorRepositories,scheduleRepository)
const doctorController = new DoctorController(doctorServices)

const appointmentRepositories = new AppointmentRepository()
const appointmentServices = new AppointmentServices(appointmentRepositories,scheduleRepository,userRepositories)
const appointmentController = new AppointmentController(appointmentServices)

const patientRepository = new PatientRepository()
const patientServices = new PatientServices(patientRepository)
const patientController = new PatientController(patientServices)

doctorRoute.post('/take_break/:scheduleId',doctorController.takeABreak.bind(doctorController))

doctorRoute.get('/appointment/list/:_id',appointmentController.getDoctorAppointments.bind(appointmentController))
doctorRoute.post("/appointment/cancel/:_id",appointmentController.cancelBooking.bind(appointmentController))
doctorRoute.get("/appointment/cancel_when_break/:_id",appointmentController.cancelBookingWhenBreak.bind(appointmentController))

doctorRoute.get('/patient',patientController.getPatients.bind(patientController))
doctorRoute.get('/patient/view/:_id',patientController.getPatient.bind(patientController))

export default doctorRoute