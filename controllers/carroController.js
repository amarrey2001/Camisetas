const db = require('../db');

// Muestra el carrito de compras (GET /carro)
exports.mostrarCarrito = (req, res) => {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }

    const idUsuario = req.session.user.id;

    // Unimos carrito con camiseta para saber qué estamos comprando
    const sql = `
        SELECT 
            c.id, 
            c.cantidad, 
            c.precio_unitario, 
            c.subtotal,
            p.marca, 
            p.talla, 
            p.color, 
            p.sexo
        FROM carrito c
        JOIN camiseta p ON c.camiseta = p.id
        WHERE c.usuario = ?
    `;

    db.query(sql, [idUsuario], (err, resultados) => {
        if (err) {
            console.error(err);
            return res.render('error', { mensaje: 'Error al obtener el carrito' });
        }

        const total = resultados.reduce((suma, item) => suma + item.subtotal, 0);

        // 👇 AQUÍ ESTABA TU ERROR VISUAL: debe apuntar a la vista de lista, no a 'add'
        res.render('carro/list', {
            items: resultados,
            total: total,
            user: req.session.user
        });
    });
};

// Añade un producto al carrito (POST /carrito/add)
exports.addCamiseta = (req, res) => {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }

    // Datos que vienen del formulario (Pug)
    const { camiseta_id, cantidad } = req.body;
    const usuario_id = req.session.user.id;

    // 1. Primero necesitamos saber el precio de la camiseta para calcular el subtotal
    const queryPrecio = 'SELECT precio FROM camiseta WHERE id = ?';

    db.query(queryPrecio, [camiseta_id], (err, result) => {
        if (err || result.length === 0) {
            return res.render('error', { mensaje: 'Producto no encontrado' });
        }

        const precio = result[0].precio;
        const subtotal = precio * cantidad;

        // 2. Insertamos en la tabla CARRITO
        const sqlInsert = `
            INSERT INTO carrito (usuario, camiseta, cantidad, precio_unitario, subtotal) 
            VALUES (?, ?, ?, ?, ?)
        `;

        db.query(sqlInsert, [usuario_id, camiseta_id, cantidad, precio, subtotal], (err, result) => {
            if (err) {
                console.error(err);
                return res.render('error', { mensaje: 'Error al añadir al carrito' });
            }

            res.redirect('/carro');
        });
    });
};

// Borrar un producto del carrito (POST /carrito/delete/:id)
exports.deleteCamiseta = (req, res) => {
    const { id } = req.params; // ID de la línea del carrito

    const sql = 'DELETE FROM carrito WHERE id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.render('error', { mensaje: 'Error al eliminar producto' });
        }
        res.redirect('/carro');
    });
};