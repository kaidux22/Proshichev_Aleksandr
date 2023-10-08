const express = require('express')
const path = require('path')
const client = path.resolve(__dirname, "../views")
const app = express()


app.set("view engine", "pug")
app.set(client)

const routes = require("./routes");

app.use("/", routes);
app.listen(3000);


