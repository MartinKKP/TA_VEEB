const express = require("express");
const fs = require("fs");
//päringu lahtiharutaja POST jaoks
const bodyparser = require("body-parser");
const mysql = require("mysql2");
const dateEt = require("./src/dateTimeET");
const dbInfo = require("../../VP_2025_config");
const textRef = "public/txt/vanasonad.txt";
//käivitan express.js funktsiooni ja annan talle nimeks "app"
const app = express();
//määran veebilehtede mallide renderdamise mootori
app.set("view engine", "ejs");
//määran ühe päris kataloogi avalikult kättesaadavaks
app.use(express.static("public"));
//parsime päringu URL-i, lipp false, kui ainult tekst ja true, kui muid andmeid ka
app.use(bodyparser.urlencoded({extended: false}));

//loon andmebaasi ühenduse
const conn = mysql.createConnection({
	host:dbInfo.configData.host,
	user:dbInfo.configData.user,
	password:dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
});
app.get("/", (req, res)=>{
	//res.send("Express.js läks käima ja serveerib veebi!");
	res.render("index");
});

app.get("/timenow", (req, res)=>{
	const weekDayNow = dateEt.weekDay();
	const dateNow = dateEt.fullDate();
	res.render("timenow", {weekDayNow: weekDayNow, dateNow: dateNow});
});

app.get("/vanasonad", (req, res)=>{
	let folkWisdom = [];
	fs.readFile(textRef, "utf8", (err, data)=>{
		if(err){
			//kui tuleb viga, siis ikka väljastame veebilehe, liuhtsalt vanasõnu pole ühtegi
			res.render("genericlist", {heading: "Valik Eesti vanasõnu", listData: ["Ei leidnud ühtegi vanasõna!"]});
		}
		else {
			folkWisdom = data.split(";");
			res.render("genericlist", {heading: "Valik Eesti vanasõnu", listData: folkWisdom});
		}
	});
});

app.get("/regvisit", (req, res)=>{
	res.render("regvisit");
});

app.post("/regvisit", (req, res)=>{
	console.log(req.body);
	//avan tekstifaili kirjutamiseks sellisel moel, et kui teda pole, luuakse (parameeter "a")
	fs.open("public/txt/visitlog.txt", "a", (err, file)=>{
		if(err){
			throw(err);
		}
		else {
			//faili senisele sisule lisamine
			fs.appendFile("public/txt/visitlog.txt", req.body.firstNameInput + " " + req.body.lastNameInput + ", " + dateEt.fullDate() + " kell " + dateEt.fullTime() + ";", (err)=>{
				if(err){
					throw(err);
				}
				else {
					console.log("Salvestatud!");
					res.render("visitregistered", {visitor: req.body.firstNameInput + " " + req.body.lastNameInput});
				}
			});
		}
	});
});

app.get("/visitlog", (req, res)=>{
	let listData = [];
	fs.readFile("public/txt/visitlog.txt", "utf8", (err, data)=>{
		if(err){
			//kui tuleb viga, siis ikka väljastame veebilehe, liuhtsalt vanasõnu pole ühtegi
			res.render("genericlist", {heading: "Registreeritud külastused", listData: ["Ei leidnud ühtegi külastust!"]});
		}
		else {
			listData = data.split(";");
			let correctListData = [];
			for(let i = 0; i < listData.length - 1; i ++){
				correctListData.push(listData[i]);
			}
			res.render("genericlist", {heading: "registreeritud külastused", listData: listData});
		}
	});
});
app.get("/Eestifilm", (req, res)=>{
	res.render("Eestifilm");
});

app.get("/Eestifilm/inimesed", (req, res)=>{
	const sqlReq = "SELECT * FROM person";
	conn.execute(sqlReq, (err, sqlres)=>{
		if(err){
			throw(err);
		}
		else {
			console.log(sqlres);
			res.render("filmiinimesed", {personList: sqlres});
		}
	});
	//res.render("filmiinimesed");
});

app.get("/Eestifilm/filmiinimesed_add", (req, res)=>{
	console.log(req.body);
	res.render("filmiinimesed_add", {notice: "OOTAN ANDMEID"});
});

app.post("/Eestifilm/filmiinimesed_add", (req, res)=>{
	console.log(req.body);
	if(!req.body.firstNameInput	||!req.body.lastNameInput ||!req.body.bornInput	||req.body.bornInput >= new Date()){
		res.render("filmiinimesed_add",{notice: "osa andmeid oli puudu või ebakorrektsed"});
	}
	else{
		let sqlReq = "INSERT INTO person (first_name, last_name, born, deceased) VALUES (?,?,?,?)";
		conn.esecute(sqlReq, [req.body.firstNameInput, req.body.lastNameInput, req.body.bornInput,req.body.deceasedInput], (err, sqlres)=>{
			if(err){
				red.render("filmiinimesed_add", {notice: "Andmete salvestamine ebaõnnestus"});
			}
			else{
				res.render("filmiinimesed_add", {notice: "Andmete salvestamine õnnestus"});
			}
		})
	}
	res.render("filmiinimesed_add");
})

app.listen(5120);