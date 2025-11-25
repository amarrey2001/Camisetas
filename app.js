// Cargamos módulos
// Enrutador (backend)
const express = require('express')
// Soporte de sesiones de Express 
const session = require('express-session')
const bodyParser = require('body-parser')
const path = require('path')
const camisetaRouter = require('./routes/camisetaRouter')
const authRouter = require('./routes/authRouter')
const carroRouter = require('./routes/carroRouter')
const productoRouter = require('./routes/productoRouter')
const pedidoRouter = require('./routes/pedidoRouter')

// crea el objeto servidor Web
// todavía no sirve páginas (hay que darle
// la orden)
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

// Middleware para capturar rutas
app.use( (req,res,next) =>{
  res.locals.currentUser = req.session.user;
  
  if (req.path.startsWith('/auth')) {
    console.log('AUTH')
    next()
  } else {
    if (req.path.startsWith('/admin')) {
      if (req.session.tipo == 'OPERADOR') next()
      else res.redirect('/auth/login')
    } else {
      next()
    }        
  }
} )

app.use('/admin/camiseta', camisetaRouter)
app.use('/auth', authRouter)
app.use('/carro', carroRouter)
app.use('/camiseta', productoRouter)
app.use('/pedido',pedidoRouter)

// TO_DO meterlo en un controlador de rutas generales
app.get('/', (req, res) =>{
  res.render('index')
})

// le doy la orden de escuchar en el puerto 
// indicado y servir páginas Web
app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})
