const app = require('express')()
const server = require('http').createServer(app)
const User = require('./model/user')
const Notice = require('./model/notice')
const Users = require('./onlineUsers')
const users = new Users()

const io = require('socket.io')(server, {
  cors: {
      origin: "http://localhost:9080",
      methods: ["GET", "POST"],
      transports: ['websocket', 'polling'],
      credentials: true
  },
  allowEIO3: true
})

io.on('connection', socket => {
  console.log('sid', socket.id)
  // срабатывает при входе
  socket.on('userJoined', async data => {
      users.add(data)
      User.update(
        { online: 'Y' },
        { where: { id: data.id } }
      )
      .then(res =>{
        let user = users.get(data.id)
        socket.broadcast.to(data.room).emit('noticeUser', data.id)
        io.emit('online', data.id)
        //socket.emit('noticeUser', data.id);
      })
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
    .then(user =>{
      io.emit('offline', data.id)
    })
    .catch(err =>
      console.log('userLeft err:', err)
    )
  })

  // срабатывает при добавлении файла в папку
  socket.on('userAddFiles', data => {
    Notice.create({
      title: `У Вас новый файл(ы) от ${data.ownerName}`,
      text: 'Перейдите в свою папку папку для ознакомления',
      userId: data.userId
    })
    socket.broadcast.to(data.sid).emit('noticeUser', data.id);
  })

  // срабатывает при прочтении уведомления
  socket.on('notisRead', data => {
    Notice.update(
      { status: 'readit' },
      { where: { id: data.id } }
    )
    .then(notices =>{
      socket.emit('noticeUser', data.userId)
    })
    .catch(err =>
      console.log('userLeft err:', err)
    )
    socket.emit('noticeUser', data.userId)
  })

  // срабатывает при удалении уведомления
  socket.on('notisDelete', data => {
    Notice.destroy({ where: { id: data.id }})
    .then(notices=>{
      socket.emit('noticeUser', data.userId)
    })
    .catch((err)=>{
      console.log(err)
    });
    
  })

  socket.on('disconnect', () => {
    const user = users.remove(socket.id)
    console.log(user)
    if (user) {
      io.to(user.room).emit('updateUsers', users.getByRoom(user.room))
    }
  })
})

module.exports = {
  app,
  server
}