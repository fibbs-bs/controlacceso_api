const {authCtrl} = require ("..//controllers/user.controllers");
const express = require ("express");

const router= express.Router();



router.get(
    "/getHistorialAcceso",
    authCtrl.getHistorialAcceso
);
router.get('/getHistorial',authCtrl.getHistorial);













module.exports = router;