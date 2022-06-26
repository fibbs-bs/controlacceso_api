const { json } = require('body-parser');
const db = require ('../middleware/connection')
const bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer');



const authCtrl = {};

authCtrl.getHistorial = async (req,res) => {
    await db.query(
        `select t.nombre as sala, m.rut as rut_usuario,
        p.bloque as bloque, h.inicio, h.fin from acceso m
        inner join planificacion p on (m.id_planificacion = p.id)
        inner join sala t on (t.codigo = p.sala)
		inner join horario h on (h.bloque = p.bloque) `
    ).then((result)=>{
        res.status(200).json(result.rows)
    })
    .catch((e)=>console.log(e))
}
authCtrl.getHistorialAcceso = async function (req,res) {
    await db.query(
        `select t.nombre as sala, m.rut as rut_usuario,
        p.bloque as bloque, h.inicio, h.fin from acceso m
        inner join planificacion p on (m.id_planificacion = p.id)
        inner join sala t on (t.codigo = p.sala)
		inner join horario h on (h.bloque = p.bloque) `
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


authCtrl.registrarUsuario = async function (req,res){

    nombre = req.body.nombre;
    rut = req.body.rut;
    correo= req.body.correo;

    const nodemailer = require('nodemailer');
    const log = console.log;
    const ran = 2;
    require('dotenv').config();

    // Step 1
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL, // TODO: your gmail account
            pass: process.env.PASSWORD // TODO: your gmail password
        },
        port: 485
    });

    // Step 2
    let mailOptions = {
        from: process.env.EMAIL, // TODO: email sender
        to: correo, // TODO: email receiver
        subject: 'Nodemailer - Test',
        text: 'Wooohooo it works!!',
        attachments: [{
            filename: 'logo.png',
            path: './images/logo.png'
        }]
    };


    // Step 3
    transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            res.status(404).json({
                msg: "No existe un usuario con ese rut."
            });
            return log('Error occurs');

        }
        res.status(200).json({
            msg: "email enviado"
        })
        return log('Email sent!!!');
    });



};










module.exports = {
    authCtrl,
};