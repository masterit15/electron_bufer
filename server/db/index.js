const Sequelize = require("sequelize");
const config = require('config')
const sequelize = new Sequelize(config.get('db.name'), config.get('db.login'), config.get('db.password'), {
  dialect: "mysql",
  host: "127.0.0.1",
  define: {
    timestamps: false
  },
  logging: false
});
sequelize.sync().then(result=>{
  // console.log(result);
})
.catch(err=> {
  console.log(err)
});
module.exports = sequelize;