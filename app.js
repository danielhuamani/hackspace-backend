var express = require("express");
var app = express();
var faker = require('faker');
var loadash = require("lodash");

app.get("/hola-mundo", function(req, res){

	res.send("hola Mundo")
});
app.get("/amigos", function(req, res){


});


app.listen(3000)
