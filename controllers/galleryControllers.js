const mysql = require("mysql2/promise");
const dbInfo = require("../../../VP_2025_config");

const dbConf = {
    host: dbInfo.configData.host,
    user: dbInfo.configData.user,
    password: dbInfo.configData.passWord,
    database: dbInfo.configData.dataBase
};

//@desc home page for photogallery
//@route GET /photogallery
//@access public

const galleryHome = async (req, res)=>{
	/* let conn;
	try {
		conn = await mysql.createConnection(dbConf);
		let sqlReq = "SELECT filename, alttext FROM galleryphotos_ta WHERE privacy >= ? AND deleteit IS NULL";
		const privacy = 2;
		const [rows, fields] = await conn.execute(sqlReq, [privacy]);
		console.log(rows);
		let galleryData = [];
		for (let i = 0; i < rows.length; i ++){
			let altTtext = "Galeriipilt";
			if(rows[i].alttext != ""){
				altText = rows[i].alttext;
			}
			galleryData.push({src: rows[i].filename, alt: altText});
		}
		res.render("gallery", {galleryData: galleryData, imagehref: "/gallery/thumbs/"});
	}
	catch(err){
		console.log(err);
		res.render("gallery", {listData: []});
	}
	finally {
	  if(conn){
	    await conn.end();
	    console.log("Andmebaasiأ¼hendus on suletud!");
	  }
	} */
	res.redirect("/photogallery/1");
};

const galleryPage = async (req, res)=>{
	let conn;
	const photoLimit = 5;
	const privacy = 2;
	let page = parseInt(req.params.page);
	//let skip = (page - 1) * photoLimit;
	let skip = 0


	try {
		if(page < 1 || isNaN(page)){
			page = 1;
		}
		//vaatame palju üldse fotosid on
		conn = await mysql.createConnection(dbConf);
		let sqlReq = "SELECT COUNT(id) AS photos FROM galleryphotos_ta WHERE privacy >= ? AND deleteit IS NULL";
		const [countResult] =await conn.execute(sqlReq, [privacy]);
		const photoCount  = countResult[0].photos;
		//valime leheküljenumbri, kui see on valitud liiga suur
		if ((page - 1) * photoLimit >= photoCount ){
			page = Math.max(1, Math.ceil(photoCount / photoLimit));
		}
		skip = (page - 1) * photoLimit;

		if(page === 1){
			galleryLinks = "Eelmine leht &nbsp;&nbsp;&nbsp; || &nbsp;&nbsp;&nbsp;";
		} else {
			galleryLinks = `<a href="/photogallery/${page - 1}" >Eelmine leht</a> &nbsp;&nbsp;&nbsp; || &nbsp;&nbsp;&nbsp;"`;
		}
		if(page * photoLimit >= photoCount){
			galleryLinks += "Järgmine leht";
		}else {
			galleryLinks += `<a href ="/photogallery/${page + 1}"> Järgmine leht </a>`;
		}
		console.log(galleryLinks)

		conn = await mysql.createConnection(dbConf);
		sqlReq = "SELECT filename, alttext FROM galleryphotos_ta WHERE privacy >= ? AND deleteit IS NULL LIMIT ?, ?";
		
		const [rows, fields] = await conn.execute(sqlReq, [privacy, skip, photoLimit]);
		console.log(rows);
		let galleryData = [];
		for (let i = 0; i < rows.length; i ++){
			let altTtext = "Galeriipilt";
			if(rows[i].alttext != ""){
				altText = rows[i].alttext;
			}
			galleryData.push({src: rows[i].filename, alt: altText});
		}
		res.render("gallery", {galleryData: galleryData, imagehref: "/gallery/thumbs/", links:galleryLinks});
	}
	catch(err){
		console.log(err);
		res.render("gallery",{galleryData: [], links: ""});
	}
	finally {
	  if(conn){
	    await conn.end();
	    console.log("Andmebaasiأ¼hendus on suletud!");
	  }
	}

};
module.exports = {
	galleryHome,
	galleryPage
};