import { json } from 'body-parser'
import db from '../models/index'

let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll()
        return res.render('homePage.ejs', {data: JSON.stringify(data)})
    } catch (error) {
        console.log(e)
    }
}

let getCRUD = (req, res) => {
    return res.send('CRUD')
}

module.exports = {
    getHomePage, getCRUD
}