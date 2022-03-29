module.exports = (req, res, next) => {
    
    if(req.isAuthenticated()) {           // verificación a travez de passport si tiene una sesión activa            
        return next()
    }
    // en caso contrario que vuelva al login
    res.redirect('/auth/login')
}