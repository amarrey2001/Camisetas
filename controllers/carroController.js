const db = require('../db')

exports.addCamisetaForm = (req, res) => {
    const { id } = req.params;

    if (isNaN(id)){
        res.render(
            'error',
            {mensaje:'Añadiendo al carro: falta un parámetro'})
    }

    let query = 'SELECT * FROM camiseta where id=?'

    db.query(query, id, (error, resultado)=>{
        if (error) {
            res.render('error', {
                mensaje: 'Imposible acceder a la camiseta'})
        } else {
            datos = resultado[0]
            res.render('carro/add')
        }
    })

}

exports.addCamiseta = (req, res) => {
    const {pedido, producto, cantidad} = req.body
    const { id } = req.params;
    // Crear si no existe el pedido
    const sqlPedido = "INSERT INTO `pedido` \
        (`fecha`, `estado`, `cliente`, `total`) \
        VALUES (now(), 'carrito', ?, '0.00')"
    // TODO: sólo podemos añadir camisetas a pedidos que
    // estén en modo "carrito", si no estaríamos modificando
    // un pedido pagado y sin cobrar por el producto.
    const sqlLineaPedido = "INSERT INTO `linea_pedido` " +
        "(pedido, producto, precio_venta, cantidad) "+
        "VALUES(?,?,NULL,?)"
    res.redirect('/carro')
}

exports.delCamiseta = (req, res) => {
    const { id } = req.params;

    // Comprobamos que el id sea válido
    if (isNaN(id)) {
        res.render('error', { mensaje: 'Eliminar del carro: falta un parámetro' });
        return;
    }

    // Borrar la línea de pedido correspondiente del carrito
    const sql = "DELETE FROM linea_pedido WHERE id=" + id;

    db.query(sql, function(error) {
        if (error) {
            res.render('error', { mensaje: 'No se pudo eliminar la camiseta del carrito' });
        } else {
            // Redirigimos al carro después de borrar
            res.redirect('/carro');
        }
    });
};

/*
// añadir al carro
router.get('/add/camiseta/:id', carroController.addCamisetaForm)
router.post('/add/camiseta/:id', carroController.addCamiseta)

// quitar del carro
router.get('/del/camiseta/:id', carroController.delCamisetaForm)
router.post('/del/camiseta/:id', carroController.delCamiseta)

// pagar
router.get('/procesar', carroController.procesarCarroForm)
router.post('/procesar', carroController.procesarCarro)

// ver el contenido de la cesta de la compra
router.get('', carroController.muestraCarro)

*/