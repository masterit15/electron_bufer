const app = require('express')()
const server = require('http').createServer(app)
const User = require('./model/user')
const File = require('./model/file')
const Notice = require('./model/notice')
const Users = require('./onlineUsers')
const user = new Users()
const m = (name, text, id) => ({name, text, id})
const io = require('socket.io')(server, {
  cors: {
      origin: process.env.NODE_ENV === 'production' ? '*' : 'http://localhost:9080',
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
      socket.join(data.room)
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
          socket.emit('userIsOnline', data.id);
          socket.broadcast.to(data.room).emit('noticeUser', data.id);
          socket.broadcast.to(data.room).emit('online', data.id)
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
    let files = []
    data.files.forEach(file => {
      files.push(convertEmoji(file))
    });
    // convertEmoji(str)
    Notice.create({
      title: `У Вас новый файл(ы) от ${data.username}`,
      text: `${files}`,
      userId: data.id
    })
    let thisUser = user.getBiId(data.id)
    if(thisUser){
      socket.broadcast.to(thisUser.sid).emit('noticeUser', thisUser.id)
      socket.broadcast.to(thisUser.sid).emit('updateChange', thisUser.id)
    }
  })
  socket.on('updateChange', data => {
    console.log('updateChange');
    let thisUser = user.getBiId(data.id)
    if(thisUser){
      io.to(thisUser.room).emit('updateChange', data.activeFolderUserId);
    }
  })
  //
  socket.on('fileStatus', data=> {
    console.log('fileStatus');
    File.update(
      { status: 'viewed' },
      { where: { id: data.fileId } }
    )
    .then(files =>{
      let thisUser = user.getBiId(data.userId)
      if(thisUser){
        io.to(thisUser.room).emit('fileStatus', {userId: thisUser.id, filesId: [...data.fileId]});
      }
    })
    .catch(err =>
      console.log('userLeft err:', err)
    )
  })
  // срабатывает при прочтении уведомления
  socket.on('noticeRead', data=> {
    Notice.update(
      { status: 'readit' },
      { where: { id: data.msId } }
    )
    .then(notices =>{
      socket.emit('noticeUser', data.id)
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
        socket.broadcast.to(thisUser.room).emit('offline', thisUser.id)
        user.remove(socket.id)
      })
      .catch(err =>
        console.log('userLeft err:', err)
      )
    }
  })
})
function convertEmoji(str) {
  let rex = /[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/ug;
  return str.replace(rex, match => `[e-${match.codePointAt(0).toString(16)}]`);
}
module.exports = {
  app,
  server
}