const { json, text } = require('body-parser');
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

    await db.query(
        `INSERT INTO persona(rut,nombre,correo)
            VALUES ($1,$2,$3)`,[rut,nombre,correo]
    ).then(()=>{
        res.status(200).json({
            msg: "Registro correcto de usuario."
        })
        const nodemailer = require('nodemailer');
        const log = console.log;
        require('dotenv').config();
        const QRCode = require('qrcode')

        const generateQR = async text => {
            try{
                await QRCode.toFile('./images/QRAcceso.png', text);
            } catch(err){
                console.error(err)
            }
        }

        generateQR("ACS-"+rut)

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
            subject: 'QR Acceso salas',
            html: 'Gracias '+nombre+' por registrarte en Acceso Salas UCN.<br>A continuación se le adjunta su codigo QR para el acceso a las salas<br><br><img src="cid:qr"/><br><br><ul><li>Dirígete a cualquier token de acceso en cualquier sala de la EIC.</li><li>Escanea el QR enviado a tu correo registrado en la página web y espera a la luz amarilla.</li><li>Cuando la luz amarilla esté prendida acerca tu tarjeta estudiantil UCN al puerto de lector de chips (lector RFID).</li><li>Retira tu tarjeta cuando aparezca la luz verde.</li><li>Podrás visualizar si la transacción de registro de tu tarjeta fue realizada correctamente o no en la pantalla del lector.</li></ul>',
            attachments: [{
                filename: 'QRAcceso.png',
                path: './images/QRAcceso.png',
                cid: 'qr'
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
    })
    .catch((err)=>{
        if (err.constraint=="persona_pkey"){
            res.status(406).json({msg:"Rut ya registrado."})
            const nodemailer = require('nodemailer');
            const log = console.log;
            require('dotenv').config();
            const QRCode = require('qrcode')

            const generateQR = async text => {
                try{
                    await QRCode.toFile('./images/QRAcceso.png', text);
                } catch(err){
                    console.error(err)
                }
            }

            generateQR("ACS-"+rut)

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
                subject: 'QR Acceso salas',
                text: 'Gracias'+nombre+'por registrarte en Acceso Salas UCN!!!,\na continuación se le adjunta su codigo QR para el acceso a las salas',
                attachments: [{
                    filename: 'QRAcceso.png',
                    path: './images/QRAcceso.png'
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
        }
        else{
            res.status(500).json({msg:"Error en el ingreso de datos."})
        }
    })
};










module.exports = {
    authCtrl,
};