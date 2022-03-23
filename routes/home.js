const express = require('express')
const router = express.Router()

router.get("/", (req, res) => {
    // simulando desde de base de datos
    const urls = [
        {origin: "www.google.com/bluuweb1", shortURL: "jkjkjjk1"},
        {origin: "www.google.com/bluuweb2", shortURL: "jkjkjjk2"},
        {origin: "www.google.com/bluuweb3", shortURL: "jkjkjjk3"},
    ]

      res.render('home', {urls: urls})      //manda los datos

      // res.send("Estas solicitando la ruta Raíz")
})




module.exports = router