const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')

const corsOptions = {
'credentials': true,
'origin': true,
'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
'allowedHeaders': 'Authorization,X-Requested-With,X-HTTP-Method-Override,Content-Type,Cache-Control,Accept,Access-Control-Allow-Origin'
}

app.use(cors(corsOptions))

app.engine('html', require('ejs').renderFile);

app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'))
app.use('/jquery-ui', express.static(__dirname + '/node_modules/jquery-ui/dist/'))
app.use(express.static('views'));
app.use("/", require('./routes.js'))

app.listen(3000)