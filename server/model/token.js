const Sequelize = require("sequelize");
const sequelize = require('../db')
const Token = sequelize.define('token', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    token: { type: Sequelize.TEXT, allowNull: false},
  })

module.exports = Token