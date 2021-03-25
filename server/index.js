const express = require('express')
const { app, server } = require('./socket')
const bodyParser = require('body-parser')
const config = require('config')
const sequelize = require('./db')

app.use(express.json({ extended: true }))

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*") // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
    next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/api/user', require('./routes/user.routes'))
app.use('/api/folder', require('./routes/folder.routes'))
app.use('/api/upload', require('./routes/upload.routes'))
app.use('/api/departament', require('./routes/departament.routes'))

if (process.env.NODE_ENV === 'production') {
  app.use('/', (req, res)=>{
    res.sendStatus(404)
  })
  app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'))
  })
}
const PORT = config.get('port') || 5050

async function start() {
    try {
        await sequelize.authenticate();
        server.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))
        console.log('Connection has been established successfully.')
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}
start()