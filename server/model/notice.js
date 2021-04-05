const Sequelize = require("sequelize");
const sequelize = require('../db')
const Notice = sequelize.define('notice', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    title: { type: Sequelize.STRING, allowNull: false},
    text: { type: Sequelize.TEXT, allowNull: true},
    date: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    status: {type: Sequelize.ENUM, values:['readit','unread'], defaultValue: 'unread'},
  })
module.exports = Notice