const Sequelize = require("sequelize");
const sequelize = require('../db')
const Folder = require('./folder')
const User = sequelize.define('user', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    login: { type: Sequelize.STRING, allowNull: false},
    avatar: { type: Sequelize.TEXT, allowNull: false},
    permission: {type: Sequelize.ENUM, values:['Администратор','Сотрудник'], defaultValue: 'Сотрудник'},
    username: { type: Sequelize.STRING, allowNull: false},
  })
User.hasMany(Folder);
module.exports = User