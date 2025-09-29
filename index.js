const express = require ("express");
const fs = require("fs");
//päringu lahtiharutaja POST jaoks
const bodyparser = require("bodyparser");
const dateET = require("./src/dateTimeET");
const textRef = "public/txt/vanasonad.txt";
//Käivitan express funktsiooni ja anna talle nime "app"
const app = express();
//Määran veebilehtede mallide renderdamise mootori
app.set("view engine", "ejs");
//määran ühe päris kataoogi, avalikult kättesaadavaks.
app.use(express.static("public"));
//parsime päringu URL'i, lipp false, kui ianult tekst ja true, kui muid andmeid ka
app.use(bodyparser.urlencoded({extended: false}));

app.get("/", (req, res)=>{
	//res. send("Express.js läks käima ja serveerib veebi!");
	res.render("index");
});
app.get("/timenow",( req, res)=>{
	const weekDayNow = dateET.fullDate();
	const dateNow = dateET.fullDate();
	res.render("timenow", {weekDayNow: weekDayNow,dateNOw: dateNow});
});
app.get("/vanasonad", (req, res)=>{
	let folkWisdom = [];
	fs.readFile(textRef, "utf8",(err, data) =>{
		if (err){
			//kui tuleb viga siis ikka väljastame veebilehe, lihtsalt vanasõnu pole ühtegi
			res.render("genericlist", {heading: "Vanasõnad", listData:["ei leidnud ühtegi vanasõna!"]});
		}
		else{
			folkWisdom = data.split(";");
			res.render("genericlist", {heading: "Vanasõnad", listData: folkWisdom});
		}
	});

app.get("/regvisit", (req, res)=>{
	res.render("regvisit");
});	
app.post("/regvisit",(req, res)=>{
	console.log(req.body);
	//avan tekstifaili kijrutamiseks sellisel moel, et kui teda pole siis luuakse.(parameeter "a")
	fs.open("public/txt/visitlog.txt", "a", (err,file)=>{
		if(err){
			throw(err);
		}
		else{
			//faili senisele sisule lisamine
			fs.appendFile("public/txt/visitlog.txt", req.body.nameInput + "; , (err,)=>{
				if(err){
					throw(err);
				}
				else{
					console.log("salvestatud!");
					res.render("regvisit");
				}
			});
		}
	});
	
	
});

app.listen(5120);