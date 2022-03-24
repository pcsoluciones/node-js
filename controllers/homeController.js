const { default: mongoose } = require('mongoose')
const Url = require('../models/Url')
const { nanoid } = require('nanoid')    // genera id aleatorios


const leerUrls = async (req, res) => {
    try {
        const urls = await Url.find().lean()    // lean() convierte el objeto que viene en formato de mongoose
        res.render('home', {urls: urls})      //manda los datos
    } catch (error) {
        console.log(error)
        res.send('falló algo ...')
    }
  
}

const agregarUrl = async(req, res) => {
    const { origin } = req.body           // recupera el valor con destructor
  try {
        const url = new Url({ origin: origin, shortURL: nanoid(8) })
        await url.save()
        res.redirect('/')
    } catch (error) {
        console.log(error)
        res.send('error, algo falló')
    }
}

const eliminarUrl = async(req,res) => {
    const { id } = req.params       // recupera el parámetro pasado como id
    try {
        await Url.findByIdAndDelete(id)
        res.redirect('/')
    } catch (error) {
        console.log(error)
        res.send('error, algo falló')
    }
}

const editarUrlForm = async(req, res) => {
    const { id } = req.params
    try {
        const url = await Url.findById(id).lean()
        //console.log(url)
        res.render('home', {url})
    } catch (error) {
        console.log(error)
        res.send('error, algo falló')
    }
}

const editarUrl = async(req, res) => {
    const { id } = req.params
    const {origin}  = req.body
    try {
        await Url.findByIdAndUpdate(id, {origin: origin})
        res.redirect('/')
    } catch (error) {
        console.log(error)
        res.send('error, algo falló')
    }
}

// cuando alguien visite el :shortURL lo caopturo para cambiar su dirección web
const redireccionamiento = async(req, res) => {
    const {shortURL} = req.params
    try {
        const urlDB = await Url.findOne({shortURL: shortURL})
        res.redirect(urlDB.origin)
        console.log(urlDB.origin)
    } catch (error) {
        
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