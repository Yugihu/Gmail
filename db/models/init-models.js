var DataTypes = require("sequelize").DataTypes;
var _blockedlist = require("./blockedlist");
var _mails = require("./mails");
var _refreshtokens = require("./refreshtokens");
var _users = require("./users");

function initModels(sequelize) {
  var blockedlist = _blockedlist(sequelize, DataTypes);
  var mails = _mails(sequelize, DataTypes);
  var refreshtokens = _refreshtokens(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

  users.belongsToMany(users, { as: 'blocked_users', through: blockedlist, foreignKey: "blocker", otherKey: "blocked" });
  users.belongsToMany(users, { as: 'blocker_users', through: blockedlist, foreignKey: "blocked", otherKey: "blocker" });
  blockedlist.belongsTo(users, { as: "blocker_user", foreignKey: "blocker"});
  users.hasMany(blockedlist, { as: "blockedlists", foreignKey: "blocker"});
  blockedlist.belongsTo(users, { as: "blocked_user", foreignKey: "blocked"});
  users.hasMany(blockedlist, { as: "blocked_blockedlists", foreignKey: "blocked"});
  mails.belongsTo(users, { as: "sender_user", foreignKey: "sender"});
  users.hasMany(mails, { as: "mails", foreignKey: "sender"});
  mails.belongsTo(users, { as: "reciver_user", foreignKey: "reciver"});
  users.hasMany(mails, { as: "reciver_mails", foreignKey: "reciver"});
  refreshtokens.belongsTo(users, { as: "username_user", foreignKey: "username"});
  users.hasOne(refreshtokens, { as: "refreshtoken", foreignKey: "username"});

  return {
    blockedlist,
    mails,
    refreshtokens,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
