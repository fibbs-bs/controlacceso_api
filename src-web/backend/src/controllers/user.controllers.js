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


authCtrl.getRuts = async function (req,res) {
    await db.query(
        `select p.rut from persona p`
    ).then((data)=>{
        if (data.rowCount==0){
            res.status(404).json({
                msg: "No se encontraron personas."
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


authCtrl.getBloques = async function (req,res) {
    await db.query(
        `select distinct p.bloque from planificacion p`
    ).then((data)=>{
        if (data.rowCount==0){
            res.status(404).json({
                msg: "No se encontraron personas."
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


authCtrl.getSalas = async function (req,res) {
    await db.query(
        `select distinct p.sala, m.nombre as nombre_sala from planificacion p
        inner join sala m on (m.codigo = p.sala)`
    ).then((data)=>{
        if (data.rowCount==0){
            res.status(404).json({
                msg: "No se encontraron personas."
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
            html: 'Gracias '+nombre+' por registrarte en Acceso Salas UCN.<br>A continuación se le adjunta su codigo QR para el acceso a las salas<br><br><p style = "text-align:center;"><img src="cid:qr"/></p><br><br><p style = "text-align:left;"><ul><li>Dirígete a cualquier token de acceso en cualquier sala de la EIC.</li><li>Escanea el QR enviado a tu correo registrado en la página web y espera a la luz amarilla.</li><li>Cuando la luz amarilla esté prendida acerca tu tarjeta estudiantil UCN al puerto de lector de chips (lector RFID).</li><li>Retira tu tarjeta cuando aparezca la luz verde.</li><li>Podrás visualizar si la transacción de registro de tu tarjeta fue realizada correctamente o no en la pantalla del lector.</li></ul></p>',
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

            updatedb = async function(){
                await db.query(
                    `update persona set nombre = $1,
                    correo =$2
                    where rut = $3`,[nombre,correo,rut]
                )
            }
            updatedb();
            

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
                html: 'Gracias '+nombre+' por registrarte en Acceso Salas UCN.<br>A continuación se le adjunta su codigo QR para el acceso a las salas<br><br><p style = "text-align:center;"><img src="cid:qr"/></p><br><br><ul><li>Dirígete a cualquier token de acceso en cualquier sala de la EIC.</li><li>Escanea el QR enviado a tu correo registrado en la página web y espera a la luz amarilla.</li><li>Cuando la luz amarilla esté prendida acerca tu tarjeta estudiantil UCN al puerto de lector de chips (lector RFID).</li><li>Retira tu tarjeta cuando aparezca la luz verde.</li><li>Podrás visualizar si la transacción de registro de tu tarjeta fue realizada correctamente o no en la pantalla del lector.</li></ul>',
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
        }
        else{
            res.status(500).json({msg:"Error en el ingreso de datos."})
        }
    })
};


authCtrl.eliminarAcceso = async function (req,res){
    rut = req.body.rut;
    bloque = req.body.bloque;
    sala = req.body.sala;

    await db.query(
        `select rut from acceso where rut = $1 and id_planificacion = (select id from planificacion where bloque = $2 and sala= $3)`,[rut,bloque,sala]
    ).then((data)=>{
        if (data.rowCount==0){
            res.status(404).json({
                msg: "No existe un usuario con ese rut."
            })
        }
        else{
            eliminacion = async function (){
                await db.query(
                    `delete from acceso where rut = $1 and id_planificacion = (select id from planificacion where bloque = $2 and sala= $3)`,[rut,bloque,sala]
                ).then((data)=>{
                    res.status(200).json({
                        msg: "Acceso eliminado"
                    })
                }).catch((err)=>{
                    res.status(500).json({
                        err,
                        msg: "Error interno en el servidor."
                    })
                })
            }
            eliminacion();
        }
    }).catch((err)=>{
        res.status(500).json({
            err,
            msg: "Error interno en el servidor."
        })
    })
}



authCtrl.generarAcceso = async function (req,res){
    rut = req.body.rut;
    bloque = req.body.bloque;
    sala = req.body.sala;

    await db.query(
        `select rut from acceso where rut = $1 and id_planificacion = (select id from planificacion where bloque = $2 and sala= $3)`,[rut,bloque,sala]
    ).then((data)=>{
        if (data.rowCount!=0){
            res.status(404).json({
                msg: "Este usuario ya tiene acceso a esa sala y bloque."
            })
        }
        else{
            insercion = async function (){

                var bloquesep=bloque.split('')
                var bloqueord=bloquesep[3]+bloquesep[0]+bloquesep[1]
                var bloquemay=bloqueord.toUpperCase()

                var ceros = '0000'
                var salaceros= `${sala}${ceros} `

                var salacerocutfinal= salaceros.substring(0,4)

                var id_plan= `${bloquemay}${salacerocutfinal}`
                var id=`${id_plan}${rut}`

                await db.query(
                    `insert into acceso (id,id_planificacion,rut)
                    values($1,$2,$3)`,[id,id_plan,rut]
                ).then((data)=>{
                    res.status(200).json({
                        msg: "Acceso generado"
                    })
                }).catch((err)=>{
                    res.status(500).json({
                        err,
                        msg: "Error interno en el servidor."
                    })
                })
            }
            insercion();
        }
    }).catch((err)=>{
        res.status(500).json({
            err,
            msg: "Error interno en el servidor."
        })
    })
}






module.exports = {
    authCtrl,
};