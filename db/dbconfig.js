const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('mysql://root:21371067@localhost:3306/mail_manager')

module.exports = sequelize
