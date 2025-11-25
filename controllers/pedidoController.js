const { urlencoded } = require('body-parser')
const db = require('../db')

exports.pedidos = (req, res) => {
    let query = 'SELECT * FROM pedido'

    db.query(query, (error, resultado) =>{
        if (error) {
            res.render('error', {
                mensaje: 'Imposible acceder a los pedidos'})
        } else {
            res.render('pedido/list', {pedidos: resultado})
        }
    })
}

exports.pedido = (req, res) => {
    const { id } = req.params;
    if (isNaN(id)){
        res.render(
            'error',
            {mensaje:'PEDIDO GETONE PARAMETROS INCORRECTOS'})
    }
    let query = 'SELECT * FROM pedido where id=?'

    db.query(query, id, (error, resultado)=>{
        if (error) {
            res.render('error', {
                mensaje: 'Imposible acceder a el pedido'})
        } else {
            res.render('pedido/list', {pedidos: resultado})
        }
    })
}

exports.pedidoUpdateForm = (req, res) => {
    const { id } = req.params;
    if (isNaN(id)){
        res.render(
            'error',
            {mensaje:'PEDIDO GETONE PARAMETROS INCORRECTOS'})
    }
    let query = 'SELECT * FROM pedido where id=?'

    db.query(query, id, (error, resultado)=>{
        if (error) {
            res.render('error', {
                mensaje: 'Imposible acceder a el pedido'})
        } else {
            datos = resultado[0]
            console.log(datos)
            res.render('pedido/edit', {datos})
        }
    })
}

exports.pedidoUpdate = (req, res) => {
    // El id viene en la ruta
    const { id } = req.params;

    // Datos que vienen del formulario
    const { fecha, estado, cliente, total } = req.body;

    let sql = "UPDATE `pedido` SET \
        `fecha` = ?, \
        `estado` = ?, \
        `cliente` = ?, \
        `total` = ? \
        WHERE `id` = ?";

    db.query(sql, [fecha, estado, cliente, total, id], (error, resultado) => {
        if (error) {
            console.log(error);
            res.render('error', {
                mensaje: 'Imposible actualizar el pedido'})
        } else {
            res.redirect('/admin/pedido');
        }
    });
};