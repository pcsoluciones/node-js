const User = require("../models/User")
const {nanoid} = require("nanoid")

const registerForm = (req, res) => {
    res.render('register')
}

const registerUser = async(req, res) => {
    console.log(req.body)
    //res.json(req.body)
    const {userName, email, password} = req.body
    try {
        let user = await User.findOne({email: email})
        // res.json(user)     //entrega null si no existe
        if (user) throw new Error('Ya existe el usuario')       // throw, hace que salte al error
        
        user = new User( {userName, email, password, tokenConfirm: nanoid()} )
        await user.save()       // graba en la base de datos
        //console.log(user)           // se pinta en la consola de visual studio
        res.redirect('/auth/login')
        //res.json(user)              // se pinta en el navegador
    } catch (error) {
        res.json({error: error.message})     // se pinta en el navegador
        console.log({error: error.message})     // se pinta en la consola de visual studio
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
        // enviar correo electrónico con la confirmación de la cuenta
        res.redirect('/auth/login')

    } catch (error) {
        res.json({error: error.message})     // se pinta en el navegador
    }
}


const loginForm = (req, res) => {
    res.render('login')
}

const loginUser = async(req, res) => {
    const{ email, password} = req.body
    try {
        const user = await User.findOne({email})
        if (!user) throw new Error('No existe este email')

        if (!user.cuentaConfirmada) throw new Error('Falta confirmar cuenta')

        //comprueba la contraseña
        if (!await user.comparePassword(password)) throw new Error('Contraseña inválida, no corresponde')

        // si existe usuario y contrasela es correcta
        console.log(req.body)
        res.send('contraseña válida ' + password )   
        //res.redirect('/')
        
        
    } catch (error) {
        console.log(error)
        res.send(error.message)
    }

}



module.exports = {
    loginForm,
    loginUser,
    registerForm, 
    registerUser,
    confirmarCuenta
}
