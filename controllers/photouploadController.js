
const mysql = require("mysql2/promise");
const dbInfo = require("../../../VP_2025_config");
const fs = require("fs").promises;
const sharp = require("sharp");


const dbConf = {
	host:dbInfo.configData.host,
	user:dbInfo.configData.user,
	password:dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
}

//@desc home page for uploading gallery photos
//@route GET /galleryphotoupload
//@Access public
//app.get("/Eestifilm", (req, res)=>{
const photouploadPage = (req, res)=>{
	res.render("galleryphotoupload");
};

const photouploadPagePost = async (req, res)=>{
	let conn;
	console.log(req.body);
	console.log(req.file);
	try {
	  const fileName = "vp_" + Date.now() + ".jpg";
	  console.log(fileName);
	  await fs.rename(req.file.path, req.file.destination + fileName);
	  //loon normaalsuuruse 800x600
	  await sharp(req.file.destination + fileName).resize(800,600).jpeg({quality: 90}).toFile("./public/gallery/normal/" + fileName);
	  //loon thumbnail pildi 100x100
	  await sharp(req.file.destination + fileName).resize(100,100).jpeg({quality: 90}).toFile("./public/gallery/thumbs/" + fileName);
	  conn = await mysql.createConnection(dbConf);
	  let sqlReq = "INSERT INTO galleryphotos_ta (filename, origname, alttext, privacy, userid) VALUES(?,?,?,?,?)";
	  //una kasutajakontosid ei ole, siis määrame userid = 1
	  const userid = 1;
	  const [result] = await conn.execute(sqlReq, [fileName, req.file.originalname, req.body.altInput, req.body.privacyInput, userid]);
	  console.log("salvestati kirje: " + result.insertId);
	  res.render("galleryphotoupload");
	}
	catch(err) {
	  console.log(err);
	  res.render("galleryphotoupload");
	}
	finally {
	  if(conn){
	  await conn.end();
	    console.log("Andmebaasiühendus on suletud!");
	  }
	}
	/*let sqlReq = "INSERT INTO person (first_name, last_name, born, deceased) VALUES (?,?,?,?)";
	
	if(!req.body.firstNameInput || !req.body.lastNameInput || !req.body.bornInput || req.body.bornInput >= new Date()){
	  res.render("filmiinimesed_add", {notice: "Osa andmeid oli puudu või ebakorrektsed"});
	}
	
	else {
		try {
			conn = await mysql.createConnection(dbConfInga);
			console.log("Andmebaasiühendus loodud!");
			let deceasedDate = null;
			if(req.body.deceasedInput != ""){
				deceasedDate = req.body.deceasedInput;
			}
			const [result] = await conn.execute(sqlReq, [req.body.firstNameInput, req.body.lastNameInput, req.body.bornInput, deceasedDate]);
			console.log("Salvestati kirje: " + result.insertId);
			res.render("filmiinimesed_add", {notice: "Andmed salvestatud"});
		}
		catch(err) {
			console.log("Viga: " + err);
			res.render("filmiinimesed_add", {notice: "Andmete salvestamine ebaõnnestus"});
		}
		finally {
			if(conn){
			await conn.end();
				console.log("Andmebaasiühendus on suletud!");
			}
		}
	}*/
};
module.exports = {
    photouploadPage,
	photouploadPagePost
};