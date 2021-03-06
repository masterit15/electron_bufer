const Sequelize = require("sequelize");
const sequelize = require('../db')
const Folder = require('./folder')
const User = require('./user')
const Departament = sequelize.define('departament', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: { type: Sequelize.STRING, allowNull: false},
  })
Departament.hasMany(User);
Departament.hasMany(Folder);

module.exports = Departament