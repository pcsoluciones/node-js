const mongoose = require('mongoose')
var bcrypt = require('bcryptjs');
const { Schema } = mongoose


const userSchema = new Schema( {
    userName: {
        type: String,
        lowercase: true,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        index: {unique: true}
    },
    password: {
        type: String,
        required: true
    },
    tokenConfirm: {
        type: String,
        default: null
    },
    cuentaConfirmada: {
        type: Boolean,
        default: false
    }
})



// Encriptación de contraseña
userSchema.pre("save", async function (next) {      // Con pre , decimos que haga algo antes
    const user = this
    if (!user.isModified("password")) return next()     // omite si ya está hascheada

    try {
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(user.password, salt)

        user.password = hash
        next()

    } catch (error) {
        console.log(error)
        throw new Error("Error al codificar la contraseña")
    }
})

userSchema.methods.comparePassword = async function(candidatePassword){
    return await bcrypt.compare(candidatePassword, this.password)
}


 
module.exports = mongoose.model("User", userSchema)

