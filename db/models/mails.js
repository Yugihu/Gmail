const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mails', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    sender: {
      type: DataTypes.STRING(255),
      allowNull: true,
      references: {
        model: 'users',
        key: 'username'
      }
    },
    reciver: {
      type: DataTypes.STRING(255),
      allowNull: true,
      references: {
        model: 'users',
        key: 'username'
      }
    },
    mailSubject: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    mailBody: {
      type: DataTypes.STRING(2550),
      allowNull: true
    },
    mailStatus: {
      type: DataTypes.STRING(2550),
      allowNull: true
    },
    sentTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    openedTime: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'mails',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "sender",
        using: "BTREE",
        fields: [
          { name: "sender" },
        ]
      },
      {
        name: "reciver",
        using: "BTREE",
        fields: [
          { name: "reciver" },
        ]
      },
    ]
  });
};
