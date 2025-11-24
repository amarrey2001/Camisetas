const { urlencoded } = require('body-parser')
const db = require('../db')


// listado
exports.list = (req, res) =>{
    const sql = "SELECT * FROM camiseta WHERE activo=1 AND stock>0"
    db.query(sql,[],(error, resultado)=>{
        if (error) {
            res.render('error', {mensaje:'Imposible leer la base de datos'})
        } else {
            res.render('producto/list', {camisetas:resultado})
        }
    })
    
}