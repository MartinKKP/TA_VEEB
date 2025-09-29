const express = require ("express");
//Käivitan express funktsiooni ja anna talle nime "app"
const app = express();
//Määran veebilehtede mallide renderdamise mootori
app.set("view engine", "ejs");

app.get("/", (req, res,)=>{
	//res. send("Express.js läks käima ja serveerib veebi!");
	res.render("index");
});

app.listen(5120);