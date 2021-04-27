const app = require('express')()
const server = require('http').createServer(app)
const User = require('./model/user')
const Notice = require('./model/notice')
const Users = require('./onlineUsers')
const user = new Users()
const m = (name, text, id) => ({name, text, id})
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
    //Вот здесь ты можешь подключить сокет к нужной тебе комнате
    socket.join(room);
    // socket.broadcast.to(room).emit('test', 'dsfsfsdfsfsdsdf')// отправит всем в этой комнате (кроме себя), что подключился новый пользователь
  })

  socket.on('userJoined', async (data, cb) => {
      // socket.join(data.room)
      if(!data.username || !data.login){
        return cb('Данные не коректны')
      }else{
        User.update(
          { online: 'Y' },
          { where: { id: data.id } }
        )
        .then(res =>{
          data.sid = socket.id
          data.room = data.departamentName
          // запихиваем пользователя в массив
          user.add(data)
          // io.sockets.in(data.room).emit('noticeUser', data.id);
          socket.broadcast.to(data.room).emit('online', data.id)
          io.emit('userIsOnline', data.id)
          cb({users: user.users, user: data})
        })
        .catch(err =>
          console.log('userJoined err:', err)
        )
    }
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
    io.sockets.in(data.room).emit('updateChange', data.folderId);
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
    let thisUser = user.get(socket.id)
    if (thisUser) {
      User.update(
        { online: 'N' },
        { where: { id: thisUser.id } }
      )
      .then(res =>{
        io.to(thisUser.room).emit('offline', thisUser.id)
        user.remove(socket.id)
      })
      .catch(err =>
        console.log('userLeft err:', err)
      )
    }
  })
})

module.exports = {
  app,
  server
}