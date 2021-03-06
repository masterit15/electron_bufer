const Sequelize = require("sequelize");
const sequelize = require('../db')
const Folder = require('./folder')
const Notice = require('./notice')
const File = require('./file');
const Token = require("./token");
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
    network: { type: Sequelize.JSON, allowNull: false},
    mac: { type: Sequelize.STRING, allowNull: false},
    lastauthorization: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    departamentName: { type: Sequelize.STRING, allowNull: false},
    // subscription: { type: Sequelize.JSON, allowNull: true},
    online: {type: Sequelize.ENUM, values:['Y','N'], defaultValue: 'N'},
  })
User.hasMany(Folder);
User.hasMany(File);
User.hasMany(Notice);
User.hasMany(Token);
module.exports = User