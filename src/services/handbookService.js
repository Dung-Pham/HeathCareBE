import db from '../models/index'

let createNewHandbook = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.contentHtml || !data.contentHandbook || !data.description) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing input parameter!`
                })
            } else {
                await db.Handbook.create({
                    name: data.name,
                    description: data.description,
                    contentHtml: data.contentHtml,
                    contentHandbook: data.contentHandbook,
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

let getAllHandbook = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.handbook.findAll() 
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
let getHandbookHome = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Handbook.findAll({
                limit: limit,
                order: [['createdAt' , 'DESC']],
                attributes: {
                    exclude: ['contentHtml', 'contentHandbook']
                }
            }) 
            // if (data && data.length > 0) {
            //     data.map(item => {
            //         item.image = new Buffer(item.image, 'base64').toString('binary')
            //         return item
            //     })
            // }
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
let getDetailHandbookService = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!id) {
                resolve({
                    errCode: 1,
                    errMessage:  `Missing input parameter!`,
                })
            }
            else {
                let data = await db.Handbook.findOne({
                    where:{
                        id: id
                    }
                })
                resolve({
                    errCode: 0,
                    errMessage: 'OK',
                    data: data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}
module.exports = {
    createNewHandbook, getAllHandbook, getHandbookHome, getDetailHandbookService
}