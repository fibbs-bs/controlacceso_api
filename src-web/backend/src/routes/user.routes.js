const {authCtrl} = require ("..//controllers/user.controllers");
const express = require ("express");

const router= express.Router();



router.get(
    "/getHistorialAcceso",
    authCtrl.getHistorialAcceso
);

router.get(
    "/getRuts",
    authCtrl.getRuts
);

router.get(
    "/getBloques",
    authCtrl.getBloques
);

router.get(
    "/getSalas",
    authCtrl.getSalas
);

router.post(
    "/registrarUsuario",
    authCtrl.registrarUsuario
);

router.post(
    "/delAcceso",
    authCtrl.eliminarAcceso
);

router.post(
    "/darAcceso",
    authCtrl.generarAcceso
);

router.get('/getHistorial',authCtrl.getHistorial);













module.exports = router;