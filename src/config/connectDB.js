require('dotenv').config()
const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(
    process.env.DB_DATABASE_NAME, 
    process.env.DB_USERNAME, 
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        // logging: 'false',
        dialectOptions: {
            "ssl": {
                "require": true,
                "rejectUnauthorized": false
            }
        }
    }
)
// const sequelize = new Sequelize('tuvansuckhoe', 'root', null, {
//     host: 'localhost',
//     dialect: 'mysql'
// })


let connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

module.exports = connectDB