import db from '../models/index'
require('dotenv').config()
import _ from 'lodash'
import emailService from '../services/mailService'

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE

let getTopDoctorHome = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limit,
                where: { roleId: 'R2' },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                ],
                raw: true,
                nest: true
            })

            resolve({
                errCode: 0,
                data: users
            })
        } catch (e) {
            reject(e)
        }
    })
}

let getAllDoctor = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: {
                    exclude: ['password', 'image']
                },
            })

            resolve({
                errCode: 0,
                data: doctors
            })
        } catch (e) {
            console.log(e)
            reject(e)
        }
    })
}

let checkRequiredFields = (inputData) => {
    let arr = ['doctorId', 'contentHtml', 'contentMarkdown', 'action', 'selectedPrice',
        'selectedPayment', 'selectedProvince', 'nameClinic', 'addressClinic', 'note', 'specialtyId']

    let isValid = true
    let element = ''
    for (let i = 0; i < arr.length; i++) {
        if (!inputData[arr[i]]) {
            isValid = false
            element = arr[i]
            break
        }
    }
    return {
        isValid,
        element
    }
}

let postInfoDoctor = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let checkObj = checkRequiredFields(data)
            if (checkObj.isValid === false) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing parameter: ${checkObj.element}!`
                })
            } else {
                // upsert to Markdown table
                if (data.action === 'CREATE') {
                    await db.Markdown.create({
                        contentHtml: data.contentHtml,
                        contentMarkdown: data.contentMarkdown,
                        description: data.description,
                        doctorId: data.doctorId,
                    })
                } else if (data.action === 'EDIT') {
                    let markdown = await db.Markdown.findOne({
                        where: { doctorId: data.doctorId },
                        raw: false,
                    })

                    // console.log('check markdown: ', markdown)

                    if (markdown) {
                        markdown.contentHtml = data.contentHtml
                        markdown.contentMarkdown = data.contentMarkdown
                        markdown.description = data.description

                        await markdown.save()
                    }
                }

                // upsert to Doctor-info table
                let doctorInfo = await db.Doctor_info.findOne({
                    where: { doctorId: data.doctorId },
                    raw: false,
                })
                if (doctorInfo) {
                    // update
                    doctorInfo.doctorId = data.doctorId
                    doctorInfo.priceId = data.selectedPrice
                    doctorInfo.paymentId = data.selectedPayment
                    doctorInfo.provinceId = data.selectedProvince
                    doctorInfo.nameClinic = data.nameClinic
                    doctorInfo.addressClinic = data.addressClinic
                    doctorInfo.note = data.note
                    doctorInfo.specialtyId = data.specialtyId
                    doctorInfo.clinicId = data.clinicId

                    await doctorInfo.save()
                } else {
                    // create
                    await db.Doctor_info.create({
                        doctorId: data.doctorId,
                        priceId: data.selectedPrice.value,
                        paymentId: data.selectedPayment.value,
                        provinceId: data.selectedProvince.value,
                        nameClinic: data.nameClinic,
                        addressClinic: data.addressClinic,
                        note: data.note,
                        specialtyId: data.specialtyId,
                        clinicId: data.clinicId,
                    })
                }
            }
            resolve({
                errCode: 0,
                errMessage: 'Save info doctor succedd!'
            })
        } catch (e) {
            console.log(e)
            reject(e)
        }
    })
}

let getDetailDoctorById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing input parameter!'
                })
            } else {
                let detailDoctor = await db.User.findOne({
                    where: { id },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['contentHTML', 'contentMarkdown', 'description']
                        },
                        {
                            model: db.Allcode,
                            as: 'positionData',
                            attributes: ['valueEn', 'valueVi']
                        },
                        {
                            model: db.Doctor_info,
                            attributes: {
                                exclude: ['id', 'doctorId', 'createdAt', 'updatedAt'],
                            },
                            include: [
                                {
                                    model: db.Allcode,
                                    as: 'priceData',
                                    attributes: ['valueEn', 'valueVi']
                                },
                                {
                                    model: db.Allcode,
                                    as: 'provinceData',
                                    attributes: ['valueEn', 'valueVi']
                                },
                                {
                                    model: db.Allcode,
                                    as: 'paymentData',
                                    attributes: ['valueEn', 'valueVi']
                                },
                            ],
                        },
                    ],
                    raw: false,
                    nest: true
                })

                if (detailDoctor && detailDoctor.image) {
                    detailDoctor.image = new Buffer(detailDoctor.image, 'base64').toString('binary')
                }

                if (!detailDoctor) detailDoctor = {}

                resolve({
                    errCode: 0,
                    data: detailDoctor
                })
            }
        } catch (e) {
            console.log(e)
            reject(e)
        }
    })
}

let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.date) {
                resolve({
                    errCode: -1,
                    errMessage: 'Missing input parameter'
                })
            } else {
                let schedule = data.arrSchedule
                if (schedule && schedule.length > 0) {
                    schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE
                        return item
                    })
                }

                // existing
                let existing = await db.Schedule.findAll({
                    where: { doctorId: data.doctorId, date: data.date },
                    attributes: ['timeType', 'doctorId', 'date', 'maxNumber'],
                    raw: true,
                })

                // different
                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return +a.date === +b.date && a.timeType === b.timeType
                })

                // Create
                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate)
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Bulk Create success!'
                })
            }
        } catch (e) {
            console.log(e)
            reject(e)
        }
    })
}

let getScheduleDoctorByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing input parameter!'
                })
            } else {
                let data = await db.Schedule.findAll({
                    where: { doctorId, date },
                    include: [
                        { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] },
                    ],
                    raw: false,
                    nest: true
                })

                resolve({
                    errCode: 0,
                    data
                })
            }
        } catch (e) {
            console.log(e)
            reject(e)
        }
    })
}

let getExtraInfoDoctorById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing input parameter!'
                })
            } else {
                let detailDoctor = await db.Doctor_info.findOne({
                    where: { doctorId },
                    attributes: {
                        exclude: ['id', 'doctorId', 'createdAt', 'updatedAt'],
                    },
                    include: [
                        {
                            model: db.Allcode,
                            as: 'priceData',
                            attributes: ['valueEn', 'valueVi']
                        },
                        {
                            model: db.Allcode,
                            as: 'provinceData',
                            attributes: ['valueEn', 'valueVi']
                        },
                        {
                            model: db.Allcode,
                            as: 'paymentData',
                            attributes: ['valueEn', 'valueVi']
                        },
                    ],
                    raw: false,
                    nest: true
                })

                if (!detailDoctor) detailDoctor = {}

                resolve({
                    errCode: 0,
                    data: detailDoctor
                })
            }
        } catch (e) {
            console.log(e)
            reject(e)
        }
    })
}

let getProfileDoctorById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing input parameter!'
                })
            } else {
                let profileDoctor = await db.User.findOne({
                    where: { id },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['contentHTML', 'contentMarkdown', 'description']
                        },
                        {
                            model: db.Allcode,
                            as: 'positionData',
                            attributes: ['valueEn', 'valueVi']
                        },
                        {
                            model: db.Doctor_info,
                            attributes: {
                                exclude: ['id', 'doctorId', 'createdAt', 'updatedAt'],
                            },
                            include: [
                                {
                                    model: db.Allcode,
                                    as: 'priceData',
                                    attributes: ['valueEn', 'valueVi']
                                },
                                {
                                    model: db.Allcode,
                                    as: 'provinceData',
                                    attributes: ['valueEn', 'valueVi']
                                },
                                {
                                    model: db.Allcode,
                                    as: 'paymentData',
                                    attributes: ['valueEn', 'valueVi']
                                },
                            ],
                        },
                    ],
                    raw: false,
                    nest: true
                })

                if (profileDoctor && profileDoctor.image) {
                    profileDoctor.image = new Buffer(profileDoctor.image, 'base64').toString('binary')
                }

                if (!profileDoctor) profileDoctor = {}

                resolve({
                    errCode: 0,
                    data: profileDoctor
                })
            }
        } catch (e) {
            console.log(e)
            reject(e)
        }
    })
}

let getListPatientForDoctor = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing input parameter!'
                })
            } else {
                let data = await db.Booking.findAll({
                    where: {
                        statusId: 'S2',
                        doctorId,
                        date
                    },
                    include: [
                        {
                            model: db.User, as: 'patientData',
                            attributes: ['email', 'firstName', 'address', 'gender'],
                            include: [
                                {
                                    model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi']
                                }
                            ]
                        },
                        {
                            model: db.Allcode, as: 'timeTypeDataPatient', attributes: ['valueEn', 'valueVi']
                        }
                    ],
                    raw: false,
                    nest: true
                })

                resolve({
                    errCode: 0,
                    data
                })
            }
        } catch (e) {
            console.log(e)
            reject(e)
        }
    })
}

let sendRemedy = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.patientId || !data.timeType) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                // update patient status
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        patientId: data.patientId,
                        timeType: data.timeType,
                        statusId: 'S2'
                    },
                    raw: false
                })

                if (appointment) {
                    appointment.statusId = 'S3'
                    await appointment.save()
                }

                // send email remedy
                await emailService.sendAttachment(data)
                resolve({
                    errCode: 0,
                    errMessage: 'ok'
                })
            }
        } catch (e) {
            console.log(e)
            reject(e)
        }
    })
}

let getNumPatient = (doctorId, date, timeType) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date || !timeType) {
                console.log("check doctorId: ", doctorId)
                console.log("check date: ", date)
                console.log("check timeType: ", timeType)
                resolve({
                    errCode: 1,
                    errMessage: 'Missing input parameter!'
                })
            } else {
                let data = await db.Booking.findAll({
                    where: {
                        statusId: 'S2',
                        doctorId,
                        date,
                        timeType
                    },
                    include: [
                        {
                            model: db.User, as: 'patientData',
                            attributes: ['email', 'firstName', 'address', 'gender'],
                            include: [
                                {
                                    model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi']
                                }
                            ]
                        },
                        {
                            model: db.Allcode, as: 'timeTypeDataPatient', attributes: ['valueEn', 'valueVi']
                        }
                    ],
                    raw: false,
                    nest: true
                })

                resolve({
                    errCode: 0,
                    data
                })
            }
        } catch (e) {
            console.log(e)
            reject(e)
        }
    })
}

module.exports = {
    getTopDoctorHome, getAllDoctor, postInfoDoctor, getDetailDoctorById,
    bulkCreateSchedule, getScheduleDoctorByDate, getExtraInfoDoctorById,
    getProfileDoctorById, getListPatientForDoctor, sendRemedy, getNumPatient
}