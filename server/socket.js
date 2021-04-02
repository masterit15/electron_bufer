const app = require('express')()
const server = require('http').createServer(app)
const User = require('./model/user')
const Notice = require('./model/notice')
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
  socket.on('userJoined', async data => {
      User.update(
        { online: 'Y' },
        { where: { id: data.id } }
      )
      .then(user =>
        socket.emit('online', user)
      )
      .catch(err =>
        console.log('userJoined err:', err)
      )
  })
  // срабатывает при выходе
  socket.on('userLeft', async data => {
    User.update(
      { online: 'N' },
      { where: { id: data.id } }
    )
    .then(user =>
      socket.emit('offline', user)
    )
    .catch(err =>
      console.log('userLeft err:', err)
    )
  })


  // срабатывает при добавлении файла в папку
  socket.on('userAddFiles', data => {
    console.log(data)
    Notice.create({
      title: `У Вас новый файл(ы) от ${data.ownerName}`,
      text: 'Перейдите в свою папку папку для ознакомления',
      userId: data.userId
    })
    socket.emit('noticeUser', data)
  })
  socket.on('disconnect', () => {
    console.log('disconnect')
  })
})

module.exports = {
  app,
  server
}