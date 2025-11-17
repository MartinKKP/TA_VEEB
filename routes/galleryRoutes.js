const express = require("express");

const router = express.Router();

//kontrollerid
const {
	galleryHome,
	galleryPage} = require("../controllers/galleryControllers");

router.route("/").get(galleryHome);

router.route("/:page").get(galleryPage); //PEAB OLEMA VIIMANE

module.exports = router;





