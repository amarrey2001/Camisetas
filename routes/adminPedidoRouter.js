const express = require('express')
const router = express.Router()
const pedidoController = require('../controllers/pedidoController')

router.get('/', pedidoController.listarPedidosAdmin);

router.post('/:id/estado', pedidoController.cambiarEstadoPedido);

module.exports = router;