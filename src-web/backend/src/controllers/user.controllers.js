const { json } = require('body-parser');
const db = require ('../middleware/connection')
const bcrypt = require("bcryptjs");

const authCtrl = {};

authCtrl.getUsuarios = async function (req,res) {
    await db.query(
        `select * from persona
        limit 5 `
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