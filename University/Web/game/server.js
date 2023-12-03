const express = require('express')
const path = require('path')
const app = express()
const routes = require("./routes.js");


app.use("/src", express.static(__dirname + '/src'));
app.use("/styles", express.static(__dirname + '/styles'));
app.use("/scripts", express.static(__dirname + '/scripts'));
app.use("/design", express.static(__dirname + '/design'))

app.set('view engine', 'pug')
app.set('view engine', 'less')

app.use("/", routes);
app.listen(3000);

