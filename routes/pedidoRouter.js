const express = require('express')
const router = express.Router()
const pedidoController = require('../controllers/pedidoController')

router.get('/', pedidoController.pedidos)

router.get('/mis-pedidos', pedidoController.pedidos);

router.get('/crear', pedidoController.pedidoCreateForm)
router.post('/crear', pedidoController.pedidoCreate)

router.get("/tramitar", pedidoController.tramitarPedidoForm);
router.post("/tramitar", pedidoController.tramitarPedido);

router.get('/edit/:id', pedidoController.pedidoUpdateForm)
router.post('/edit/:id', pedidoController.pedidoUpdate)

router.get('/:id',pedidoController.pedido)

router.get('/confirmado/:id', pedidoController.pedidoConfirmado)
router.post("/confirmar", pedidoController.tramitarPedido);

module.exports = router
