var express = require("express");
var app = express();
var faker = require('faker');
var loadash = require("lodash");

app.get("/hola-mundo", function(req, res){

	res.send("hola Mundo")
});

function generarAmigos(){
	var randomId =  faker.random.uuid();
	var randomPais = faker.address.country();
	var randomFecha = faker.date.past();
	var randomContent = faker.lorem.sentence();
	var randomName = faker.name.findName();
	var randomEmail = faker.internet.email();
	var randomImage = faker.image.avatar();
	var amigo = {
		id: randomId,
		nombre: randomName,
		pais: randomPais,
		fecha: randomFecha,
		contenido: randomContent,
		email: randomEmail,
		imagen: randomImage
	}
	return amigo;
}

app.get("/amigos", function(req, res){
	var limite = loadash.random(5,10)
	var usuarios = loadash.times(limite, generarAmigos)
	res.json(usuarios);
});


app.listen(3000)
