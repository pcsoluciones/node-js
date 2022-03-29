const express = require('express')
const { body } = require('express-validator')       // valida y personaliza los mensajes de error

const { registerForm, 
        registerUser, 
        loginForm, 
        loginUser,
        confirmarCuenta,
        cerrarSesion
} = require('../controllers/authController')


const router = express.Router()

router.get("/register", registerForm)

router.post("/register", 
            [ 
                body("userName", "Ingrese un nombre válido express-validator")
                    .trim()
                    .notEmpty()
                    .escape(),
                body("email", "Ingrese un email válido")
                    .trim()
                    .isEmail()
                    .normalizeEmail(), 
                body("password", "Contraseña de mínimo 6 carácteres")
                    .trim()
                    .isLength({min: 6})
                    .escape()
                    .custom((value, {req}) => {
                        if (value !== req.body.repassword) {
                            throw new Error("No coinciden las contraseñas")
                        } else {
                            return value
                        }
                        
                    })
            ],
            registerUser)

router.get("/login", loginForm)

router.post("/login", 
            [ 
                body("email", "Ingrese un email válido")
                    .trim()
                    .isEmail()
                    .normalizeEmail(), 
                body("password", "Contraseña de mínimo 6 carácteres")
                    .trim()
                    .isLength({min: 6})
                    .escape()
            ],
            loginUser)

        
router.get("/confirmar/:token", confirmarCuenta)

router.get('/logout', cerrarSesion)


module.exports = router
