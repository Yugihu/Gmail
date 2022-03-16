const sequelize = require("./dbconfig");
const initModels = require("./models/init-models");

const models = initModels(sequelize);

module.exports = models