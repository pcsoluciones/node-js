const express = require("express")
const session = require('express-session')
const MongoStore = require("connect-mongo");
const flash = require('connect-flash')          // es un tipo de sesion que solo vive una vez
const passport = require('passport')
const mongoSanitize = require('express-mongo-sanitize') // evita inyecciones a mongodb
var cors = require('cors')
const { create } = require("express-handlebars");
const csrf = require('csurf')
const User = require("./models/User");
//const res = require("express/lib/response");

require('dotenv').config()
// require('./database/db')
const clienteDB = require('./database/db');

const app = express()

const corsOptions = {
    credentials: true,
    origin: process.env.PATHHEROKU || "*",
    methods: ['GET', 'POST']
}
app.use(cors())


app.use(
    session({
        secret: process.env.SECRETSESSION,
        resave: false,
        saveUninitialized:  false,
        name: "session-user",
        store : MongoStore.create({
            clientPromise: clienteDB,
            dbName: process.env.DBNAME
        }),
        cookie: { secure: process.env.MODO === 'production', 
                maxAge: 30 * 24 * 60 * 60 * 1000 }
    })
)

app.use(flash())

// PASSPORT
app.use(passport.initialize())
app.use(passport.session())


//        mis preguntas
passport.serializeUser( (user, done) => done(null, {id: user._id, userName: user.userName}) )  // datos que irán a req.user   

passport.deserializeUser(async (user, done) => {
    // será necesario volver a revisar la BD?, SI porque es necesario para poder crear una api 
    // buscamos el usuario de la session en la base de datos
    const userDB = await User.findById(user.id)     
    // con los datos encontrados se vuelve a crear el req.user creado con passport.serializeUser()
    return done(null, { id: userDB._id, userName: userDB.userName})
})




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



app.use(csrf())         // habilita protecciones de token para los formularios

app.use(mongoSanitize())    // para evitar inyeccciones a mongo


// creamos un middleware para generar el token csrf de forma global
app.use((req, res, next) => {
    // se envia una variable global a todas las vistas para no tener que colocarlo en cada formulario
    res.locals.csrfToken = req.csrfToken    

    res.locals.mensajes = req.flash("mensajes")     // permita pasar los mensajes de error a las vistas

    next()
})


app.use("/", require('./routes/home'))
app.use("/auth", require('./routes/auth'))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log("Servidor andando 😁" + PORT))




/*
//  Sesiones  ----------------------------------------------------
app.use(                        // middleware
    session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized:  false,
        name: "secret-name-blabla"
    })
)

app.get("/ruta-protegida", (req, res) =>{
    res.json(req.session.usuario || "Sin sesión de usuario")
})

app.get("/crear-session", (req, res) => {
    req.session.usuario = "usuario bluuweb conectado"
    res.redirect("/ruta-protegida")
})

app.get("/destruir-session", (req, res) => {
    req.session.destroy()
    res.redirect("/ruta-protegida")
})

//-----------------------------------------------------------------------------


// uso para flash ------------------------------------------------------
app.use(flash())
app.get("/mensaje-flash", (req, res) => {
    //console.log(req.flash())                    // al mostrar acá, no se verá en la sgte. línea
    res.json(req.flash("mensaje"))
})
app.get("/crear-mensaje", (req, res) => {
    req.flash("mensaje", "este es un mensaje de prueba")
    res.redirect("/mensaje-flash")
})
// -----------------------------------------------------------------------------

*/
