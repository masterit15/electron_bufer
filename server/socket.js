const app = require('express')()
const server = require('http').createServer(app)
const User = require('./model/user')
const io = require('socket.io')(server, {
  cors: {
      origin: "http://localhost:9080",
      methods: ["GET", "POST"],
      transports: ['websocket', 'polling'],
      credentials: true
  },
  allowEIO3: true
})

const m = (name, text, id) => ({ name, text, id })
io.on('connection', socket => {
  socket.on('userRegister', data => {
    console.log(data)
    const {login, avatar, permission, username, departamentId} = data
    User.create({
      login, 
      avatar, 
      permission, 
      username, 
      departamentId
    })
  })
  // срабатывает при входе
  socket.on('userJoined', data => {
    console.log('userJoined', data)
    socket.emit('online', data)
  })
  // срабатывает при выходе
  socket.on('userLeft', data => {
    console.log('userLeft', data)
    socket.emit('offline', data)
    // let user = await User.findOne({ where: { id: data.userId } }); 
    // user.online = "N";
    // await user.save();
  })
  // срабатывает при добавлении файла в папку
  socket.on('userAddFiles', data => {
    console.log('userJoined', data)
    socket.emit('online', data)
  })
  socket.on('disconnect', () => {
    console.log('disconnect')
  })
})

module.exports = {
  app,
  server
}