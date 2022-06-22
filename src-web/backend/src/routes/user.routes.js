const {authCtrl} = require ("..//controllers/user.controllers");
const express = require ("express");

const router= express.Router();


router.get(
    "/getUsuarios",
    authCtrl.getUsuarios
);
















module.exports = router;