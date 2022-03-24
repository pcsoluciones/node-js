const express = require("express")
const { create } = require("express-handlebars");

require('dotenv').config()
require('./database/db')

const app = express()

const hbs = create({
    extname: ".hbs",
    partialsDir: ["views/components"]
});
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", "./views");



// middleware  ( use )
app.use(express.static(__dirname + "/public"))
app.use(express.urlencoded({extended:true}))        // para habilitarla lectura body del formulario
app.use("/", require('./routes/home'))
app.use("/auth", require('./routes/auth'))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log("Servidor andando 😁" + PORT))