// Cargamos módulos
// Enrutador (backend)
const express = require('express')
// Soporte de sesiones de Express 
const session = require('express-session')
const bodyParser = require('body-parser')
const path = require('path')

// Importación de rutas
const camisetaRouter = require('./routes/camisetaRouter')
const authRouter = require('./routes/authRouter')
const carroRouter = require('./routes/carroRouter')
const productoRouter = require('./routes/productoRouter')
const pedidoRouter = require('./routes/pedidoRouter')
const publicoController = require('./controllers/camisetaController')

// crea el objeto servidor Web
const app = express()

// cargo el .ENV (el mismo de DOCKER)
require('dotenv').config({ path: './stack-camisetas/.env' })
const port = process.env.APP_PORT

// Configuración de Pug
app.set('view engine', 'pug')

// Le decimos a express que use bodyparser
// para recoger datos de formularios
app.use(bodyParser.urlencoded({ extended: true }))

// habilitamos sesiones
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false
}))

// Middleware GLOBAL para capturar rutas y seguridad
app.use((req, res, next) => {
    // 1. Pasamos el usuario a todas las vistas PUG
    // Usamos 'user' porque en tu nav.pug pones "if user"
    res.locals.user = req.session.user;

    // 2. Lógica de protección de rutas
    if (req.path.startsWith('/auth')) {
        // Si va al login/registro, pasa sin preguntar
        next()
    } else {
        // Si intenta entrar a una ruta de ADMIN
        if (req.path.startsWith('/admin')) {

            // Verificamos si existe el usuario Y si es OPERADOR
            if (req.session.user && req.session.user.tipo == 'OPERADOR') {
                next() // Tiene permiso, adelante
            } else {
                // No tiene permiso o no está logueado -> Al login
                console.log('Intento de acceso no autorizado a Admin')
                res.redirect('/auth/login')
            }

        } else {
            // Cualquier otra ruta (pública)
            next()
        }
    }
})

// Definición de Rutas
app.use('/admin/camiseta', camisetaRouter)
app.use('/auth', authRouter)
app.use('/carro', carroRouter)
app.use('/camiseta', productoRouter)
app.use('/pedido', pedidoRouter)

// Ruta home
app.get('/', publicoController.catalogo)

// Arrancar el servidor
app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})