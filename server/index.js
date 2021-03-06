const express = require('express')
const { app, server } = require('./socket')
const cors = require('cors')
const bodyParser = require('body-parser')
const config = require('config')
const sequelize = require('./db')
const logger = require('./loger')
const path = require('path')
const updateMiddleware = require('./middleware/update.middleware')
require('./cron')

app.use(express.json({ extended: true }))
app.use(cors())
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*") // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
    next()
})

app.use (bodyParser.json({limit: '10mb', extended: true}))
app.use (bodyParser.urlencoded({limit: '10mb', extended: true}))

app.use('/update', updateMiddleware, express.static('update'));
app.use('/static', express.static('static'));
app.use('/download', express.static('uploads'));
app.use('/api/subscribe', require('./routes/webpush.routes'))
app.use('/api/user', require('./routes/user.routes'))
app.use('/api/folder', require('./routes/folder.routes'))
app.use('/api/notice', require('./routes/notice.routes'))
app.use('/api/file', require('./routes/file.routes'))
app.use('/api/departament', require('./routes/departament.routes'))

if (process.env.NODE_ENV === 'production') {
  app.use('/', (req, res)=>{
    // res.sendStatus(404)
    res.sendFile(path.resolve(__dirname, 'index.html'))
  })
  app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'index.html'))
  })
}
const PORT = config.get('port') || 3000
const HOST =  config.get('host') || '0.0.0.0'
async function start() {
    try {
        await sequelize.authenticate();
        server.listen(PORT, HOST, () => console.log(`Приложение было запущено на порту ${PORT}...`))
        console.log('Соединение успешно установлено.')
        logger.appDiagnostic.info(`Соединение успешно установлено. Приложение было запущено на порту ${PORT}`)
      } catch (error) {
        console.error('Не удалось подключиться к базе данных:', error);
        logger.appDiagnostic.error(`Не удалось подключиться к базе данных: ${error}`)
      }
}
start()