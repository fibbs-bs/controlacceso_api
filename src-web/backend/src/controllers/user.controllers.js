const { json } = require('body-parser');
const db = require ('../middleware/connection')
const bcrypt = require("bcryptjs");

const authCtrl = {};


authCtrl.getHistorialAcceso = async function (req,res) {
    await db.query(
        `select t.nombre as sala, m.rut_persona as rut_usuario,
        p.bloque_horario as bloque, p.fecha_inicio, p.fecha_fin from acceso m
        inner join planificacion p on (m.id_planificacion = p.id)
        inner join sala t on (t.codigo = p.codigo_sala) `
    ).then((data)=>{
        if (data.rowCount==0){
            res.status(404).json({
                msg: "No se encontraron elementos que mostrar."
            })
        }
        else{
            console.log(data.rows)
            res.status(200).json({
                data:data.rows
            })
        }
    }).catch((err)=>{
        res.status(500).json({
            err,
            msg: "Error en la obtención de datos."
        })
    })
};














module.exports = {
    authCtrl,
};