const Sequelize = require("sequelize");
const sequelize = require('../db')
const Folder = require('./folder')
const Notice = require('./notice')
const File = require('./file')
const User = sequelize.define('user', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    login: { type: Sequelize.STRING, allowNull: false},
    avatar: { type: Sequelize.TEXT, allowNull: true},
    permission: {type: Sequelize.ENUM, values:['Администратор','Сотрудник'], defaultValue: 'Сотрудник'},
    username: { type: Sequelize.STRING, allowNull: false},
  })
User.hasMany(Folder);
User.hasMany(File);
User.hasMany(Notice);

module.exports = User