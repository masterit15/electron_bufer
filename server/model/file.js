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
    owner: { type: Sequelize.INTEGER, allowNull: false},
    mimeType: { type: Sequelize.STRING, allowNull: false},
    
    originalName: { type: Sequelize.STRING, allowNull: false},

  })

module.exports = File