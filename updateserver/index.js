
const express = require('express');
const fileUpload = require('express-fileupload');
const morgan = require('morgan');
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser')
const PORT = 5080;


app.use(fileUpload());
app.use(morgan('dev'));

app.use(express.json({ extended: true }))
app.use(cors())

app.use (bodyParser.json({limit: '10mb', extended: true}))
app.use (bodyParser.urlencoded({limit: '10mb', extended: true}))

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*") // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
    next()
})

// app.use('/update', require('./routes/update.routes'))
app.use('/upload', require('./routes/upload.routes'))
app.use('/update', express.static('files'));

app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});