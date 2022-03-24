const { URL } = require("url");         // nativo de node

const validarURL = (req, res, next) => {
    try {
        const { origin } = req.body;
        const urlFrontend = new URL(origin);

        if (urlFrontend.origin !== "null") {
            return next();
        } else {
            throw new Error("no válida 😲");
        }

    } catch (error) {
        return res.send("url no válida")
    }
};

module.exports = validarURL;