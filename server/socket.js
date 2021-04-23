const app = require('express')()
const server = require('http').createServer(app)
const User = require('./model/user')
const Notice = require('./model/notice')
const Users = require('./onlineUsers')
const user = new Users()

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
  // срабатывает при входе
  socket.on('join_room', function(room){
    // console.log('join_room',room);
    //Вот здесь ты можешь подключить сокет к нужной тебе комнате
    socket.join(room);
    
    // socket.broadcast.to(room).emit('test', 'dsfsfsdfsfsdsdf')// отправит всем в этой комнате (кроме себя), что подключился новый пользователь
  })

  socket.on('userJoined', async data => {
      // socket.join(data.room)
      User.update(
        { online: 'Y' },
        { where: { id: data.id } }
      )
      .then(res =>{
        data.sid = socket.id
        data.room = data.departamentName
        user.add(data)
        io.sockets.in(data.room).emit('noticeUser', data.id);
        socket.broadcast.to(data.room).emit('online', data.id)
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
    .then(res =>{
      user.remove(socket.id)
      socket.broadcast.to(data.room).emit('offline', data.id)
    })
    .catch(err =>
      console.log('userLeft err:', err)
    )
  })

  // срабатывает при добавлении файла в папку
  socket.on('userAddFiles', data => {
    Notice.create({
      title: `У Вас новый файл(ы) от ${data.username}`,
      text: `${data.files}`,
      userId: data.id
    })
    io.sockets.in(data.room).emit('noticeUser', data.id);
  })

  // срабатывает при прочтении уведомления
  socket.on('noticeRead', data=> {
    Notice.update(
      { status: 'readit' },
      { where: { id: data.noticeId } }
    )
    .then(notices =>{
      socket.emit('noticeUser', data.userId)
    })
    .catch(err =>
      console.log('userLeft err:', err)
    )
  })

  // срабатывает при удалении уведомления
  socket.on('noticeDelete', data => {
    Notice.destroy({ where: { id: data.id }})
    .then(notices=>{
      socket.emit('noticeUser', data.userId)
    })
    .catch((err)=>{
      console.log(err)
    });
    
  })

  socket.on('disconnect', () => {
    user.remove(socket.id)
    // if (user) {
    //   io.to(user.room).emit('updateUsers', users.getByRoom(user.room))
    // }
  })
})

module.exports = {
  app,
  server
}