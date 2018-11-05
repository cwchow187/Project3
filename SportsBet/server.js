// Dependencies
var express = require("express");
var mongojs = require("mongojs");
var bodyParser = require('body-parser');

var PORT = 3001;
var app = express();

// set the app up with bodyparser
app.use(bodyParser());

// Database configuration
var databaseUrl = "pets_db";
var collections = ["pets"];

// Hook mongojs config to db variable
var db = mongojs(databaseUrl , collections);

// Log any mongojs errors to console
db.on("error", function(error) {
  console.log("Database Error:", error);
});

/*
  if we don't do this here then we'll get this error in apps that use this api

  Fetch API cannot load No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin is therefore not allowed access. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.

  read up on CORs here: https://www.maxcdn.com/one/visual-glossary/cors/
*/
  //allow the api to be accessed by other apps
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
    next();
  });


app.get('/', function(req, res){
	res.send('hi');
});

app.get('/pets', function(req, res){
	db.pets.find(function(error, data){
		res.json(data);
	})

	// select * from pets;
})

//get is an http method

//'/pets/:id' is a url pattern

// BOTH OF THEM TOGETHER IS a route

app.get('/pets/:id', function(req, res){

	db.pets.findOne({
	  "_id": mongojs.ObjectID(req.params.id)
	}, function(error, result){
	    res.json(result);
	});

	// select * from pets;
})

/*
	how to hit a post route

	form with a method of POST and an action of /pets/5bb2de27c385cb3290b0e598

	ajax query in JavaScript with a method of post and url of /pets/5bb2de27c385cb3290b0e598

	you can do a curl call also like this:
	curl -X POST http://localhost:3001/pets/5bb2de27c385cb3290b0e598

	in node.js you can use the request package to do post request 
*/

app.post('/pets/update/:id', function(req, res){
	//curl -X POST http://localhost:3001/pets/5bb2de27c385cb3290b0e598

	db.pets.findAndModify({
		query: {
			"_id": mongojs.ObjectId(req.params.id)
		},
		update: { $set: {
			"name": req.body.name,
			"type": req.body.type}
		},
		new: true
		}, function (err, editedPet) {
				res.json(editedPet);
		});
});

app.post('/pets/:id', function(req, res){
	//curl -X POST http://localhost:3001/pets/5bb2de27c385cb3290b0e598

	db.pets.remove({
	  "_id": mongojs.ObjectID(req.params.id)
	}, function(error, removed) {
	  if (error) {
	    res.send(error);
	  }else {
	    res.json(req.params.id);
	  }
	});
});








app.post('/pets', function(req, res){
	
	// req.body may look like this: {name: 'fido', age: 3} 

	//curl -d "name=fido&age=3" -X POST http://localhost:3001/pets

	db.pets.insert(req.body, function(error, savedPet) {
	  // Log any errors
	  if (error) {
	    res.send(error);
	  }else {
	    res.json(savedPet);
	  }
	});
});

app.listen(PORT, function() {
  console.log('🌎 ==> Now listening on PORT %s! Visit http://localhost:%s in your browser!', PORT, PORT);
});



