import db from '../models/index'

let createNewSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.descriptionHtml || !data.descriptionMarkdown || !data.imageBase64) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing input parameter!`
                })
            } else {
                await db.Specialty.create({
                    name: data.name,
                    image: data.imageBase64,
                    descriptionHtml: data.descriptionHtml,
                    descriptionMarkdown: data.descriptionMarkdown,
                })

                resolve({
                    errCode: 0,
                    errMessage: `ok`
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll()
            if (data && data.length > 0) {
                data.map(item => {
                    item.image = new Buffer(item.image, 'base64').toString('binary')
                    return item
                })
            }
            resolve({
                errCode: 0,
                errMessage: 'OK',
                data
            })
        } catch (e) {
            reject(e)
        }
    })
}

let getDetailSpecialtyById = (inputId, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('check inputId: ', inputId)
            console.log('check location: ', location)
            if (!inputId || !location) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing input parameter!`
                })
            }
            else {
                let data = await db.Specialty.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: ['descriptionHtml', 'descriptionMarkdown'],
                })
                let doctorSpecialty = []
                if (data) {
                    if (location === 'ALL') {
                        doctorSpecialty = await db.Doctor_info.findAll({
                            where: { specialtyId: inputId },
                            attributes: ['doctorId', 'provinceId'],
                        })
                    } else {
                        // find by location
                        doctorSpecialty = await db.Doctor_info.findAll({
                            where: {
                                specialtyId: inputId,
                                provinceId: location
                            },
                            attributes: ['doctorId', 'provinceId'],
                        })
                    }

                    // data.doctorSpecialty = doctorSpecialty
                } else {
                    data = {}
                }
                resolve({
                    errCode: 0,
                    errMessage: `ok`,
                    data,
                    doctorSpecialty
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createNewSpecialty, getAllSpecialty, getDetailSpecialtyById
}