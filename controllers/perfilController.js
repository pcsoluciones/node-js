const formidable = require('formidable')    //  servicio enfocado en cargar y codificar imágenes y videos
const Jimp = require('jimp')                //  utilizado para realizar el procesamiento de imágenes

const fs = require('fs')            // desde modulos nativos de node, para manipular los archivos del sistema
const path = require('path')        // desde modulos nativos de node

const User = require("../models/User")


module.exports.formPerfil = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        return res.render("perfil", { user: req.user, imagen: user.imagen})
    } catch (error) {
        req.flash("mensajes", [{msg: "Error al leer el usuario"}])
        return res.redirect("/perfil")
    }
}



module.exports.editarFotoPerfil = async (req, res) => {
    const form = new formidable.IncomingForm()
    form.maxFileSize = 50 * 1024 * 1024    //50 Mb
    
    form.parse(req, async(err, fields, files) => {
        try {
            if (err)  throw new Error('Falló la subida de imagen (formidable)')

            console.log(files)
            const file = files.myFile

            if (file.originalFilename === '') throw new Error('Por favor agrega una imagén')

            /*    if (!(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')) {
                throw new Error('Por favor agrega una imagen .jpg o png')
            }  */
            const imageTypes = ["image/jpeg", "image/png"]      // otra forma de validar
            if (!imageTypes.includes(file.mimetype)) {
                throw new Error('Por favor agrega una imagen .jpg o png')
            }

            if (file.size > 50*1024*1024) throw new Error('Por favor agrega una imagen Menos de 5Mb')



            // sacamos la extensión del archivo accediendo al indice 1 del array generado
            const extension = file.mimetype.split("/")[1]
            // se crea la ruta y nombre del archivo a guardar
            const dirFile = path.join(__dirname, `../public/img/perfiles/${req.user.id}.${extension}`)
            // console.log(dirFile)


            // para guardar la imagen a la nueva ubicación
            fs.renameSync(file.filepath, dirFile)


            // leemos la imagen para su proceso
            const image = await Jimp.read(dirFile)
            image.resize(200, 200).quality(90).writeAsync(dirFile)  // sobreescribimos la imagen con su nuevo tammaño

            // se guarda la referencia de la imagen en la BD
            const user = await User.findById(req.user.id)
            user.imagen = `${req.user.id}.${extension}`
            await user.save()                 // metodo de mongoose


            req.flash("mensajes", [{msg: "Ya se subió la imagen"}])

        } catch (error) {
            req.flash("mensajes", [{msg: error.message}])
        } finally {
            return res.redirect('/perfil')
        }


    })


   // return res.json({ok:true})

}
