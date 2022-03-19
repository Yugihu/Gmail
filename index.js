//imports
const express = require('express')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')
const sequelize = require('./db/dbconfig')
const models = require('./db/dbmodels')
const { everyone } = require('./helpers/everyone')

//init
const app = express()


dotenv.config()
//middlewares
//process.env.ACCESS_TOKEN
app.use(express.json())
app.use(cookieParser())
app.use('/api/auth', require('./routes/auth'))
app.use('/api/blocked', require('./routes/blocked'))
app.use('/api/mails', require('./routes/mails'))

async function checkDb() {
    try {
        await sequelize.authenticate()
        console.log("connected Ok")
    } catch (error) {
        console.log("error", error)
    }
}
checkDb()

async function trydb() {
    console.log(await models.users.findAll({ where: { username: "bla" } }))
}
trydb()
app.listen(1000, () => { console.log("server app and running on port 1000") })