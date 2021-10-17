const Usuario = require('../models/Usuario')
const bcryptjs = require('bcryptjs')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')

exports.autenticarUsuario = async (req, res) => {

    // Revidar si hay errores con express-validator
    const errores = validationResult(req)
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() })
    }


    // extraer el email y password
    const {email, password} = req.body

    try {
        // Revidar que sea un usuario registrado
        let usuario = await Usuario.findOne({email})
        if(!usuario) {
            return res.status(400).json({msg: 'El usuario no existe'})
        }

        //revisar que el password sea el correcto
        let passCorrecto = await bcryptjs.compare(password, usuario.password)
        if(!passCorrecto) {
            return res.status(400).json({msg: 'Password Incorrecto'})
        }

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
    }

}

// Obtiene que usuario esta autenticado
exports.usuarioAutenticado = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password')
        res.json({usuario})
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: 'Hubo un error.'})
    }
}