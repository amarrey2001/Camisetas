const { urlencoded } = require('body-parser')
const db = require('../db')

exports.pedidos = (req, res) => {
    let query = 'SELECT * FROM pedido'

    db.query(query, (error, resultado) =>{
        if (error) {
            return res.render('error', {
                mensaje: 'Imposible acceder a los pedidos'})
        } else {
            return res.render('pedido/list', {pedidos: resultado})
        }
    })
}

exports.pedidoCreateForm = (req, res) => {
    // 1. Preparamos la consulta para obtener las camisetas
    const query = 'SELECT * FROM camiseta';

    // 2. Ejecutamos la consulta
    db.query(query, (error, resultados) => {
        if (error) {
            console.log(error);
            return res.render('error', { mensaje: 'Error al cargar camisetas' });
        }

        // 3. Imprimimos en consola para verificar que hay datos (mira tu terminal tras guardar)
        console.log("Camisetas encontradas:", resultados);

        // 4. Renderizamos la vista enviando la variable 'camisetas'
        // IMPORTANTE: El nombre 'camisetas' aquí debe coincidir con el del 'each' en Pug
        res.render('pedido/crear', {
            camisetas: resultados
        });
    });
}

exports.pedidoCreate = (req, res) => {
    const { camisetaId, cantidad, cliente, metodoPago, fecha, estado, pagado} = req.body
    const sql = `INSERT INTO pedido (camisetaId, cantidad, cliente, metodoPago, fecha, estado, pagado) VALUES (?,?,?,?,?,?,?)`

    db.query(sql, [camisetaId, cantidad, cliente, metodoPago, fecha, estado, pagado ? 1 : 0], (err) => {
        if(err){
            return res.render('error', { mensaje: 'Imposible crear el pedido' })
            return res.redirect('/pedido')
        }
    })
}

exports.pedido = (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.render('error', {
            mensaje: 'PEDIDO GETONE PARAMETROS INCORRECTOS'
        });
    }

    let query = 'SELECT * FROM pedido WHERE id = ?';

    db.query(query, [id], (error, resultado) => {
        if (error) {
            return res.render('error', {
                mensaje: 'Imposible acceder al pedido'
            });
        }

        if (resultado.length === 0) {
            return res.render('error', { mensaje: 'Pedido no encontrado' });
        }

        return res.render('pedido/detalle', { pedido: resultado[0] });
    });
};

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
            return res.render('error', {
                mensaje: 'Imposible acceder a el pedido'})
        } else {
            datos = resultado[0]
            console.log(datos)
            return res.render('pedido/edit', {datos})
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
            return res.render('error', {
                mensaje: 'Imposible actualizar el pedido'})
        } else {
            return res.redirect('/admin/pedido');
        }
    });
};

exports.tramitarPedidoForm = (req, res) => {
    const usuario = req.session.user;

    const usuarioId = usuario.id;

    const sql = `
        SELECT c.*, cam.marca, cam.talla, cam.color
        FROM carrito c
                 JOIN camiseta cam ON cam.id = c.camiseta
        WHERE c.usuario = ?
    `;

    db.query(sql, [usuarioId], (err, carrito) => {
        if (err) {
            console.log(err);
            return res.render("error", { mensaje: "Error al cargar el carrito" });
        }

        const total = carrito.reduce((acc, item) => acc + parseFloat(item.subtotal), 0);

        res.render("pedido/tramitar", {
            usuario,   // ahora siempre definido
            carrito,
            total
        });
    });
};


exports.tramitarPedido = (req, res) => {
    const usuarioId = req.session.user?.id;
    const { metodoPago } = req.body;

    // 1. Obtener carrito del usuario
    const sqlCarrito = "SELECT * FROM carrito WHERE usuario = ?";

    db.query(sqlCarrito, [usuarioId], (err, carrito) => {
        if (err || carrito.length === 0) {
            console.log(err);
            return res.render("error", { mensaje: "No se pudo cargar el carrito" });
        }

        const total = carrito.reduce((t, item) => t + parseFloat(item.subtotal), 0);

        // 2. Crear pedido
        const sqlPedido = `
            INSERT INTO pedido (cliente, total, estado)
            VALUES (?, ?, 'pagado')
        `;

        db.query(sqlPedido, [usuarioId, total], (err, resultado) => {
            if (err) {
                console.log(err);
                return res.render("error", { mensaje: "No se pudo crear el pedido" });
            }

            const pedidoId = resultado.insertId;

            // 3. Crear líneas de pedido
            const sqlLinea = `
                INSERT INTO linea_pedido (ID_Pedido, ID_Camiseta, Precio_Venta)
                VALUES (?, ?, ?)
            `;

            carrito.forEach(item => {
                db.query(sqlLinea,
                    [pedidoId, item.camiseta, item.precio_unitario],
                    (err) => {
                        if (err) console.log("Error línea pedido:", err);
                    }
                );
            });

            // 4. Vaciar carrito
            const sqlVaciar = "DELETE FROM carrito WHERE usuario = ?";

            db.query(sqlVaciar, [usuarioId], (err) => {
                if (err) console.log("Error vaciando carrito:", err);
            });

            // 5. Redirigir a detalle del pedido
            res.redirect(`/pedido/confirmado/${pedidoId}`);
        });
    });
};

exports.pedidoConfirmado = (req, res) => {
    const usuario = req.session.user;
    const { id } = req.params;

    const sql = `
        SELECT p.*, u.username
        FROM pedido p
        JOIN usuario u ON u.id = p.cliente
        WHERE p.id = ?
    `;

    db.query(sql, [id], (err, resultado) => {
        if (err || resultado.length === 0) {
            return res.render("error", { mensaje: "Pedido no encontrado" });
        }

        res.render("pedido/confirmado", {
            pedido: resultado[0]
        });
    });
};