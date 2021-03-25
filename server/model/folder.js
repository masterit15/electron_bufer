const Sequelize = require("sequelize");
const sequelize = require('../db')
const File = require('./file')
const Folder = sequelize.define('folder', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: { type: Sequelize.STRING, allowNull: false},
    path: { type: Sequelize.TEXT, allowNull: false},
  })
  Folder.hasMany(File);
module.exports = Folder