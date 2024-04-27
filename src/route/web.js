import express from "express"
import { getHomePage, getCRUD } from "../controllers/homeControler"
import {
    handleLogin, handleGetAllUsers,
    handleCreateNewUser, handleEditUser,
    handleDeleteUser, getALLCode
} from "../controllers/userController"
import {
    getTopDoctorHome, getAllDoctor, postInfoDoctor,
    getDetailDoctorById, bulkCreateSchedule,
    getScheduleDoctorByDate, getExtraInfoDoctorById,
    getProfileDoctorById, getListPatientForDoctor, sendRemedy, getNumPatient
} from "../controllers/doctorControler"
import { postBookAppointment, postVerifyBookAppointment } from '../controllers/patientControler'
import { createNewHandbook, getAllHandbook, getHandbookHome, getDetailHandbook} from '../controllers/handbookController'
import { createNewSpecialty, getAllSpecialty, getDetailSpecialtyById } from '../controllers/specialtyController'
import { createNewClinic, getAllClinic, getDetailClinicById } from '../controllers/clinicControler'

let router = express.Router()

let initWebRouter = (app) => {
    // homeController
    router.get('/', getHomePage)
    router.get('/crud', getCRUD)

    // userController
    router.post('/api/login', handleLogin)
    router.get('/api/get-all-users', handleGetAllUsers)
    router.post('/api/create-new-user', handleCreateNewUser)
    router.put('/api/edit-user', handleEditUser)
    router.delete('/api/delete-user', handleDeleteUser)
    router.get('/api/allcode', getALLCode)

    // doctorController
    router.get('/api/top-doctor-home', getTopDoctorHome)
    router.get('/api/get-all-doctor', getAllDoctor)
    router.post('/api/save-info-doctor', postInfoDoctor)

    // doctorController
    router.get('/api/get-detail-doctor-by-id', getDetailDoctorById)
    router.post('/api/bulk-create-schedule', bulkCreateSchedule)
    router.get('/api/get-schedule-doctor-by-date', getScheduleDoctorByDate)
    router.get('/api/get-extra-info-doctor-by-id', getExtraInfoDoctorById)
    router.get('/api/get-profile-doctor-by-id', getProfileDoctorById)
    router.post('/api/send-remedy', sendRemedy)

    router.get('/api/get-list-patient-for-doctor', getListPatientForDoctor)
    router.get('/api/get-num-patient', getNumPatient)

    // patientController
    router.post('/api/patient-book-appointment', postBookAppointment)
    router.post('/api/verify-book-appointment', postVerifyBookAppointment)

    // specialtyController
    router.post('/api/create-new-specialty', createNewSpecialty)
    router.get('/api/get-all-specialty', getAllSpecialty)
    
    // handbookController
    router.post('/api/create-new-handbook', createNewHandbook)
    router.get('/api/get-all-handbook', getAllHandbook)
    router.get('/api/get-handbook-home', getHandbookHome)
    router.get('/api/get-detail-handbook', getDetailHandbook)
    router.get('/api/get-detail-specialty-by-id', getDetailSpecialtyById)

    // clinicController
    router.post('/api/create-new-clinic', createNewClinic)
    router.get('/api/get-all-clinic', getAllClinic)
    router.get('/api/get-detail-clinic-by-id', getDetailClinicById)


    return app.use('/', router)
}

module.exports = initWebRouter