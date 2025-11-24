const { urlencoded } = require('body-parser')
const db = require('../db')
const router = require('../routes/camisetaRouter')
const carroController = require('../controllers/carroController')

// añadir al carro
router.get('/add/camiseta/:id', carroController.addCamisetaForm)
router.post('/add/camiseta/:id', carroController.addCamiseta)
/*
// quitar del carro
router.get('/del/camiseta/:id', carroController.delCamisetaForm)
router.post('/del/camiseta/:id', carroController.delCamiseta)

// pagar
router.get('/procesar', carroController.procesarCarroForm)
router.post('/procesar', carroController.procesarCarro)
*/
// ver el contenido de la cesta de la compra
// router.get('/', carroController.muestraCarro)

module.exports=router;