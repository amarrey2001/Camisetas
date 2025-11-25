const express = require('express')
const router = express.Router()
const pedidoController = require('../controllers/pedidoController')

router.get('/', pedidoController.pedidos)

router.get('/edit/:id', pedidoController.pedidoUpdateForm)
router.post('/edit/:id', pedidoController.pedidoUpdate)

router.get('/:id',pedidoController.pedido)

module.exports = router
