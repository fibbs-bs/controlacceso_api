const {authCtrl} = require ("..//controllers/user.controllers");
const express = require ("express");

const router= express.Router();



router.get(
    "/getHistorialAcceso",
    authCtrl.getHistorialAcceso
);














module.exports = router;