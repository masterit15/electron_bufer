const express = require('express')
const { app, server } = require('./socket')
const cors = require('cors')
const bodyParser = require('body-parser')
const config = require('config')
const sequelize = require('./db')
const logger = require('./loger')
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

app.use('/update', express.static('update'));
app.use('/download', express.static('uploads'));
app.use('/api/subscribe', require('./routes/webpush.routes'))
app.use('/api/user', require('./routes/user.routes'))
app.use('/api/folder', require('./routes/folder.routes'))
app.use('/api/notice', require('./routes/notice.routes'))
app.use('/api/file', require('./routes/file.routes'))
app.use('/api/departament', require('./routes/departament.routes'))

if (process.env.NODE_ENV === 'production') {
  app.use('/', (req, res)=>{
    res.sendStatus(404)
  })
  app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'))
  })
}
const PORT = config.get('port') || 3000

async function start() {
    try {
        await sequelize.authenticate();
        server.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))
        console.log('Connection has been established successfully.')
        logger.warn(`Connection has been established successfully.`)
      } catch (error) {
        console.error('Unable to connect to the database:', error);
        logger.warn(`Unable to connect to the database: ${error}`)
      }
}
start()