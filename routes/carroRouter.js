const express = require('express');
const router = express.Router();
const carroController = require('../controllers/carroController');

router.get('/', carroController.mostrarCarrito);

router.post('/add', carroController.addCamiseta);

router.post('/delete/:id', carroController.deleteCamiseta);

module.exports = router;