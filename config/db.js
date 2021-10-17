const mongoose = require('mongoose')    // Requerimos Mongoose.
require('dotenv').config({path: 'variables.env'})// Requerimos las variables de entorno.

const conectarDB = async () => {
    try {
        await mongoose.connect(process.env.DB_MONGO, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            // useFindAndModify: false
        })
        console.log('DB Conectada.')
    } catch (error) {
        console.log(error)
        process.exit(1) // si hay error detiene la aplicación.
    }
}

module.exports = conectarDB