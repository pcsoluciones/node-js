const { URL } = require("url");         // nativo de node

const validarURL = (req, res, next) => {
    try {
        const { origin } = req.body;
        const urlFrontend = new URL(origin);        // acá se comprueba que sea un formato válido de URL y salta al error

        if (urlFrontend.origin !== "null") {
            if (urlFrontend.protocol === "http:" || urlFrontend.protocol === "https:") { 
                return next() 
            } else {
                throw new Error("tiene que tener https://");    // en caso ingrese ftp://
            }
        } 
        console.log(urlFrontend.origin)
        throw new Error("no válida 😲");        // entrega un null

    } catch (error) {
        //return res.send("url no válida")
        if (error.message === "Invalid URL"){       // mensaje entregado por new URL(origin)
            req.flash("mensajes", [{msg: "url no válida"}])
        } else {
            req.flash("mensajes", [{msg: error.message}])
        }

        return res.redirect('/')
    }
};

module.exports = validarURL;