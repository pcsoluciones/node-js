const mongoose = require('mongoose')
require('dotenv').config()

const clienteDB = mongoose.connect(process.env.URI)
    .then( (m)=> {
        console.log('db conectada 🚀')
        return m.connection.getClient()
    })
    .catch(e => console.log('falló la conexión : ' + e))


    module.exports = clienteDB