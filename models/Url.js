const mongoose = require('mongoose')
const { Schema } = mongoose

const urlSchema = new Schema( {
    origin: {
        type: String,
        unique: true,
        required: true
    },
    shortURL: {
        type: String,
        unique: true,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
})

const Url = mongoose.model('Url', urlSchema)    // crea una colección en plural urls
module.exports = Url