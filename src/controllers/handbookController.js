import handbookService from '../services/handbookService'

let createNewHandbook = async (req, res) => {
    try {
        let response = await handbookService.createNewHandbook(req.body)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getAllHandbook = async (req, res) => {
    try {
        let response = await handbookService.getAllHandbook()
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let getHandbookHome = async (req, res) => {
    let limit = req.query.limit;
    if(limit === 'undefined') limit = 10;
    try {
        let response = await handbookService.getHandbookHome(+limit)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let getDetailHandbook = async (req, res) => {
    try {
        let response = await handbookService.getDetailHandbookService(req.query.id);
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

module.exports = {
    createNewHandbook, getAllHandbook, getHandbookHome, getDetailHandbook
}