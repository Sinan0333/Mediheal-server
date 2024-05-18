import express,{Router} from 'express'
import { doctorAuthMiddleware } from '../middleware/doctorAuthMiddleware'

import ScheduleRepository from '../repositories/scheduleRepository'
import UserRepository from '../repositories/userRepositories'

import DoctorRepository from '../repositories/doctorRepositories' 
import DoctorServices from '../services/doctorServices'
import DoctorController from '../controllers/doctorController'

import PatientController from '../controllers/patientController'
import PatientServices from '../services/patientServices'
import PatientRepository from '../repositories/patientRepositories'

import AppointmentRepository from '../repositories/appointmentRepositories'
import AppointmentServices from '../services/appointmentServices'
import AppointmentController from '../controllers/appointmentController'

import PrescriptionController from '../controllers/prescriptionController'
import PrescriptionServices from '../services/prescriptionServices'
import PrescriptionRepository from '../repositories/prescriptionRepositories'

import MessageController from '../controllers/messageController'
import MessageServices from '../services/messageServices'
import MessageRepository from '../repositories/messageRepositories'

import AdmitHistoryController from '../controllers/admitHistoryController'
import AdmitHistoryServices from '../services/admitHistoryServices'
import AdmitHistoryRepository from '../repositories/admitHistoryRepositories'

const doctorRoute:Router = express.Router()
doctorRoute.use(doctorAuthMiddleware)

const scheduleRepository = new ScheduleRepository()
const userRepositories = new UserRepository()

const doctorRepositories = new DoctorRepository()
const doctorServices = new DoctorServices(doctorRepositories,scheduleRepository)
const doctorController = new DoctorController(doctorServices)

const patientRepository = new PatientRepository()
const patientServices = new PatientServices(patientRepository)
const patientController = new PatientController(patientServices)

const appointmentRepositories = new AppointmentRepository()
const appointmentServices = new AppointmentServices(appointmentRepositories,scheduleRepository,userRepositories)
const appointmentController = new AppointmentController(appointmentServices,patientServices)

const prescriptionRepository = new PrescriptionRepository()
const prescriptionServices = new PrescriptionServices(prescriptionRepository)
const prescriptionController = new PrescriptionController(prescriptionServices)

const messageRepository = new MessageRepository()
const messageServices = new MessageServices(messageRepository)
const messageController = new MessageController(messageServices)

const admitHistoryRepository = new AdmitHistoryRepository()
const admitHistoryServices = new AdmitHistoryServices(admitHistoryRepository)
const admitHistoryController = new AdmitHistoryController(admitHistoryServices)

doctorRoute.post('/profile/:_id',doctorController.takeABreak.bind(doctorController))
doctorRoute.post('/take_break/:scheduleId',doctorController.takeABreak.bind(doctorController))
doctorRoute.post('/remove_break/:scheduleId',doctorController.removeBreak.bind(doctorController))

doctorRoute.get('/patient',patientController.getPatients.bind(patientController))
doctorRoute.get('/patient/view/:_id',patientController.getPatient.bind(patientController))
doctorRoute.get('/patient/view/:_id',patientController.getPatient.bind(patientController))

doctorRoute.get('/appointment/list/:_id',appointmentController.getDoctorAppointments.bind(appointmentController))
doctorRoute.post("/appointment/cancel/:_id",appointmentController.cancelBooking.bind(appointmentController))
doctorRoute.get("/appointment/cancel_when_break/:_id",appointmentController.cancelBookingWhenBreak.bind(appointmentController))
doctorRoute.get("/appointment/change_status",appointmentController.changeStatus.bind(appointmentController))
doctorRoute.post('/appointment/change_chat_status',appointmentController.changeChatStatus.bind(appointmentController))
doctorRoute.get('/appointment/count/:_id',appointmentController.totalDoctorAppointments.bind(appointmentController))
doctorRoute.get('/appointment/revenue/:_id',appointmentController.getDoctorMonthlyRevenue.bind(appointmentController))
doctorRoute.get('/appointment/status_wise_count/:_id',appointmentController.statusWiseDoctorAppointmentsCount.bind(appointmentController))
doctorRoute.get('/appointment/status_type_count/:_id',appointmentController.typeWiseDoctorAppointmentsCount.bind(appointmentController))
doctorRoute.get('/appointment/my_patients/:_id',appointmentController.doctorPatients.bind(appointmentController))
doctorRoute.get('/appointment/my_patients/count/:_id',appointmentController.totalDoctorPatients.bind(appointmentController))

doctorRoute.post('/prescription/add',prescriptionController.createPrescription.bind(prescriptionController))
doctorRoute.get('/prescription/:_id',prescriptionController.getPrescriptionData.bind(prescriptionController))
doctorRoute.get('/prescription/patient/:_id',prescriptionController.getPatientPrescriptions.bind(prescriptionController))

doctorRoute.post('/chat/create',messageController.createMessage.bind(messageController))
doctorRoute.post('/chat/chat_data',messageController.findConversationData.bind(messageController))

doctorRoute.get('/admit_history/count/:_id',admitHistoryController.totalDoctorAdmits.bind(admitHistoryController))
doctorRoute.get('/admit_history/revenue/:_id',admitHistoryController.getDoctorMonthlyRevenue.bind(admitHistoryController))

export default doctorRoute