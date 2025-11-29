const { urlencoded } = require('body-parser')
const bcrypt = require('bcrypt')
const db = require('../db')

exports.loginForm = (req, res) => {
    res.render('auth/login')
}

exports.login = (req, res) => {
    const {username, password} = req.body;
    const sql = "SELECT * FROM usuario WHERE username=?"
    // busco el usuario por username
    db.query(sql, [username], (error, result) => {
        if (error) {
            res.render('error', {mensaje: 'Imposible localizar el usuario en base de datos'})
            console.log(error)
        } else {
            if (result[0]) {
                if(result[0].activo==1 && bcrypt.compareSync(password, result[0].password)){                    
                    req.session.user = {
                        username: result[0].username,
                        tipo: result[0].tipo,
                        id: result[0].id       // <--- Aquí guardamos el ID de forma segura
                    };
                    res.redirect('/')
                } else {
                    res.render('error', {mensaje: 'Credenciales incorrectas.'})
                }
            }else {
                res.render('error', {mensaje: 'El usuario no existe'})
            }
        }
    })
    // res.redirect('/')
}

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/')
}

exports.registerForm = (req, res) => {
    res.render('auth/register')
}

exports.register = (req, res) => {
    const {username, password, telefono, direccion, email} = req.body

    let hashedPass = bcrypt.hashSync(password, 10)

    const sql = 'INSERT INTO `usuario` (`username`, `password`, `email`, `telefono`, `direccion`, `activo`, `tipo`) \
        VALUES (?, ?, ?, ?, ?, 1, "CLIENTE")';
    
    db.query(sql, [username, hashedPass, email, telefono, direccion], 
        (error, respuesta) => {
            if (error) {
                console.log(error)
                let mensaje = 'Imposible dar de alta: '+error.sqlMessage
                res.render('error', {mensaje})
            } else {
                res.redirect('login')
            }
    })
}