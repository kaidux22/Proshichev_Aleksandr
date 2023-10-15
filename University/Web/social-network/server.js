const express = require('express')
const app = express()
const path = require('path')

app.engine('html', require('ejs').renderFile);

app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'))
app.use('/jquery-ui', express.static(__dirname + '/node_modules/jquery-ui/dist/'))
app.use(express.static('views'));
app.use("/", require('./routes.js'))

app.listen(3000)