const User = require("../models/User")
const { validationResult } = require('express-validator')   
const {nanoid} = require("nanoid")
const nodemailer = require("nodemailer")

require("dotenv").config()


const registerForm = (req, res) => {
    res.render('register', { mensajes: req.flash("mensajes"), 
                csrfToken: req.csrfToken() })           // generamos un token csrfToken y lo enviamos a la vista
}



const registerUser = async(req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()){         // si errores no viene vacío envía mensajes de error
        //return res.json(errors)
        req.flash("mensajes", errors.array())
        return res.redirect('/auth/register')
    }
    //console.log(req.body)
    //res.json(req.body)
    const {userName, email, password} = req.body
    try {
        let user = await User.findOne({email: email})
        // res.json(user)     //entrega null si no existe
        if (user) throw new Error('Ya existe el usuario')       // throw, hace que salte al error
        
        user = new User( {userName, email, password, tokenConfirm: nanoid()} )
        await user.save()       // graba en la base de datos
        //console.log(user)           // se pinta en la consola de visual studio
        //res.redirect('/auth/login')
        //res.json(user)              // se pinta en el navegador

        // enviar correo electrónico con la confirmación de la cuenta
        console.log(process.env.userEmail)
        console.log(process.env.passEmail)

        const transport = nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.userEmail,
                pass: process.env.passEmail
            }
          });

        // send mail with defined transport object
        await transport.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>', // sender address
            to: user.email, // list of receivers
            subject: "Verifica tu cuenta de correo ✔", // Subject line
            //text: "Hello world?", // plain text body
            html: `<a href="http://localhost:5000/auth/confirmar/${user.tokenConfirm}" >Verifica tu cuenta aquí</a>`, // html body
        });        

        req.flash("mensajes", [ 
            { msg: "Revisa tu correo electrónico y valida cuenta" } ])
        return res.redirect('/auth/login')
    } catch (error) {
        //res.json({error: error.message})     // se pinta en el navegador
        //console.log({error: error.message})     // se pinta en la consola de visual studio
        req.flash("mensajes", [{msg: error.message}])
        return res.redirect('/auth/register')
    }
    //res.json(req.body)
}


// Confirmación de cuenta enviada al leer correo válido
const confirmarCuenta = async (req, res) => {
    const { token } = req.params                // recupera token que viene en la url

    try {
        const user = await User.findOne({tokenConfirm : token})
        if (!user) throw new Error('No existe este usuario')     //viaja el mensaje al error de catch
        
        user.cuentaConfirmada = true
        user.tokenConfirm = null

        await user.save()
        // res.json(user)

        req.flash("mensajes", [ 
            { msg: "Cuenta verificada, puedes iniciar sesión"} ])

        return res.redirect('/auth/login')

    } catch (error) {
        //res.json({error: error.message})     // se pinta en el navegador
        req.flash("mensajes", [{msg: error.message}])
        return res.redirect('/auth/login')
    }
}


const loginForm = (req, res) => {
    // res.render('login', { mensajes: req.flash("mensajes")})
    res.render('login')     // ahora los mensajes estan de forma global ( res.locals.mensajes = req.flash("mensajes") )
}


const loginUser = async(req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()){         // si errores no viene vacío envía mensajes de error
        // convertimos los errores en un array de objetos para poder gestionar mejor los errores en la vista
        //return res.json(errors.array())   
        req.flash("mensajes", errors.array())
        return res.redirect('/auth/login')
    }

    const{ email, password} = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) throw new Error('No existe este email...')

        if (!user.cuentaConfirmada) throw new Error('Falta confirmar cuenta')

        //comprueba la contraseña
        if ( !(await user.comparePassword(password)) ) throw new Error('Contraseña inválida, no corresponde')
        
        // Me está creando de sesión de usuario a través de passport
        req.login(user, function(err) {       
            if (err) throw new Error('Error al crear la sesión')
            return res.redirect('/')    // En caso que no falle lo podemos redirigir
        })

        
    } catch (error) {
        //console.log(error)
        //res.send(error.message)
        req.flash("mensajes", [{msg: error.message}])
        return res.redirect('/auth/login')
    }
}

const cerrarSesion = (req, res) => {
    req.logout()                        // método que viene de passport
    return res.redirect('/auth/login')
}



module.exports = {
    loginForm,
    loginUser,
    registerForm, 
    registerUser,
    confirmarCuenta, 
    cerrarSesion
}
