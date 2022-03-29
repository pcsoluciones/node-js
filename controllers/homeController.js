const { default: mongoose } = require('mongoose')
const Url = require('../models/Url')
const { nanoid } = require('nanoid')    // genera id aleatorios


const leerUrls = async (req, res) => {
    console.log(req.user)       // req.user exite gracias a passport y verificarUser
    try {
        // se hace la relación de las url con el usuario autentificado
        const urls = await Url.find( {user: req.user.id} ).lean()    // lean() convierte el objeto que viene en formato de mongoose
        res.render('home', {urls: urls})      //manda los datos
    } catch (error) {
        //console.log(error)
        //res.send('falló algo ...')
        req.flash("mensajes", [{msg: error.message}])
        return res.redirect('/')
    }
  
}

const agregarUrl = async(req, res) => {
    const { origin } = req.body           // recupera el valor con destructor
  try {
        const url = new Url({ origin: origin, shortURL: nanoid(8), user: req.user.id }) //se agrega la referencia al usuario autentificado
        await url.save()
        //res.redirect('/')
        req.flash("mensajes", [{msg: "Url agregada"}])
        return res.redirect('/')
    } catch (error) {
       // console.log(error)
       // res.send('error, algo falló')
       req.flash("mensajes", [{msg: error.message}])
       return res.redirect('/')
    }
}


const eliminarUrl = async(req,res) => {
    const { id } = req.params       // recupera el parámetro pasado como id
    try {
        //await Url.findByIdAndDelete(id)
        const url = await Url.findById(id)
        if (!url.user.equals(req.user.id)) {
            throw new Error("No es tu url payaso")
        }
        await url.remove()
        res.redirect('/')
    } catch (error) {
       // console.log(error)
        //res.send('error, algo falló')
        req.flash("mensajes", [{msg: error.message}])
        return res.redirect('/')
    }
}


const editarUrlForm = async(req, res) => {
    const { id } = req.params
    try {
        const url = await Url.findById(id).lean()
        //console.log(url)

        if (!url.user.equals(req.user.id)) {
            throw new Error("No es tu url payaso")
        }

        return res.render('home', {url})

    } catch (error) {
        //console.log(error)
        //res.send('error, algo falló')
        req.flash("mensajes", [{msg: error.message}])
        return res.redirect('/')
    }
}



const editarUrl = async(req, res) => {
    const { id } = req.params
    const {origin}  = req.body
    try {
        const url = await Url.findById(id)
        
        if (!url.user.equals(req.user.id)) {
            throw new Error("No es tu url payaso")
        }

        await url.update( {origin} )        // editamos solo campo origin con metodo de mongoose
        req.flash("mensajes", [{msg: "Url editada"}])

        //await Url.findByIdAndUpdate(id, {origin: origin})
        res.redirect('/')
    } catch (error) {
        //console.log(error)
        //res.send('error, algo falló')
        req.flash("mensajes", [{msg: error.message}])
        return res.redirect('/')
    }
}




// cuando alguien visite el :shortURL lo capturo para cambiar su dirección web
const redireccionamiento = async(req, res) => {
    const {shortURL} = req.params
    try {
        const urlDB = await Url.findOne({shortURL: shortURL})
        res.redirect(urlDB.origin)
        console.log(urlDB.origin)
    } catch (error) {
        req.flash("mensajes", [{msg: "No existe esta url configurada"}])
        return res.redirect('/auth/login')
    }
}



module.exports = {
    leerUrls, 
    agregarUrl,
    eliminarUrl,
    editarUrlForm,
    editarUrl,
    redireccionamiento
}