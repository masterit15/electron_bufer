const Sequelize = require("sequelize");
const sequelize = require('../db')
const File = sequelize.define('file', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: { type: Sequelize.STRING, allowNull: false},
    path: { type: Sequelize.TEXT, allowNull: false},
    size: { type: Sequelize.INTEGER, allowNull: false},
    ownerId: { type: Sequelize.INTEGER, allowNull: false},
    ownerName: { type: Sequelize.STRING, allowNull: false},
    mimeType: { type: Sequelize.STRING, allowNull: false},
    date: {type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    originalName: { type: Sequelize.STRING, allowNull: false},

  })

module.exports = File