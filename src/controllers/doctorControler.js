import doctorService from '../services/doctorService'

let getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit
    if (limit === 'undefined') limit = 10
    try {
        let data = await doctorService.getTopDoctorHome(+limit)
        return res.status(200).json(data)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server ..."
        })
    }
}

let getAllDoctor = async (req, res) => {
    try {
        let doctors = await doctorService.getAllDoctor()
        return res.status(200).json(doctors)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let postInfoDoctor = async (req, res) => {
    try {
        let response = await doctorService.postInfoDoctor(req.body)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getDetailDoctorById = async (req, res) => {
    try {
        let detailDoctor = await doctorService.getDetailDoctorById(req.query.id)
        return res.status(200).json(detailDoctor)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let bulkCreateSchedule = async (req, res) => {
    try {
        let response = await doctorService.bulkCreateSchedule(req.body)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getScheduleDoctorByDate = async (req, res) => {
    try {
        let response = await doctorService.getScheduleDoctorByDate(req.query.doctorId, req.query.date)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getExtraInfoDoctorById = async (req, res) => {
    try {
        let extraInfoDoctor = await doctorService.getExtraInfoDoctorById(req.query.doctorId)
        return res.status(200).json(extraInfoDoctor)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getProfileDoctorById = async (req, res) => {
    try {
        let profileDoctor = await doctorService.getProfileDoctorById(req.query.id)
        return res.status(200).json(profileDoctor)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getListPatientForDoctor = async (req, res) => {
    try {
        let patients = await doctorService.getListPatientForDoctor(req.query.doctorId, req.query.date)
        return res.status(200).json(patients)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let sendRemedy = async (req, res) => {
    try {
        let response = await doctorService.sendRemedy(req.body)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getNumPatient = async (req, res) => {
    try {
        let patients = await doctorService.getNumPatient(req.query.doctorId, req.query.date, req.query.timeType)
        return res.status(200).json(patients)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

module.exports = {
    getTopDoctorHome, getAllDoctor, postInfoDoctor, getDetailDoctorById,
    bulkCreateSchedule, getScheduleDoctorByDate, getExtraInfoDoctorById,
    getProfileDoctorById, getListPatientForDoctor, sendRemedy, getNumPatient
}