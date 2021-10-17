const Usuario = require('../models/Usuario')
const bcryptjs = require('bcryptjs')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')

exports.crearUsuario = async (req, res) => {

    // Revidar si hay errores con express-validator
    const errores = validationResult(req)
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() })
    }

    // extraer email  y password
    const { email, password } = req.body

    try {
        // Revisar que el usuario registrado sea unico
        let usuario = await Usuario.findOne({ email }) // El método findOne busca si hay más de un email repetido.

        if (usuario) {
            return res.status(400).json({ msg: 'El usuario ya existe' })
        }

        // crea el nuevo usuario
        usuario = new Usuario(req.body)

        // Hashear el password
        const salt = await bcryptjs.genSalt(10) // el método salt es para cuando la contraseña es muy corta 3 o 4 digitos este lo hashear más grande como si no fuera de 3 digitos.
        usuario.password = await bcryptjs.hash(password, salt)

        // guardar usuario
        await usuario.save()
        // Crear y firmar el json web token jwt
        const payload = {
            usuario: {
                id: usuario.id
            }
        }
        // firmar el jwt
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600 // 1 hora en segundos
        }, (error, token) => {
            if (error) throw error

            // mensaje de confirmación 
            res.json({token})
        })

    } catch (error) {
        console.log(error)
        res.status(400).send('Hubo un error')
    }
}