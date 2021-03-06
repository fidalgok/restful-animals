var express = require('express'),
	app = express(),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	request = require('request'),
	sanitizer = require('express-sanitizer'),
	methodOverride = require('method-override');

//app config
//connects to mongodb and creates the database if it doesn't exist
//already
mongoose.connect("mongodb://localhost/restful_animals_app");

//setup other package settings

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(sanitizer());
app.use(methodOverride("_method"));

//Mongoose config - Schema and Model

var animalSchema = new mongoose.Schema({
	name: String,
	type: String,
	speak: String,
	image: String,
	description: String,
	birthday: {type: Date, default: Date.now}
});

var Animal = mongoose.model("Animal", animalSchema);

//Routes

//Index restful route

app.get("/", function(req, res){
	res.redirect("/animals");
});

app.get("/animals", function(req, res){
	//grab all animals from the database and display them
	Animal.find({}, function(err, animals){
		if(err){
			res.send("There was an error");
		} else {
			res.render("index", {animals : animals});
		}
	});
});

//New and Create Routes

app.get("/animals/new", function(req, res){
	res.render("new");
});

app.post("/animals", function(req, res){
	//add animal to database
	req.body.animal.description = req.sanitize(req.body.animal.description);
	//find a photo on unsplash corresponding to animal type
	var unsplashAPI = "https://api.unsplash.com/photos/random/?client_id=9fc1557d20ba0c28a9bc2fe6fc2e88a1ad31da6b87c2dfb6c382a53b8c1ab263&query=";
	var animalType = req.body.animal.type;
	var url = unsplashAPI + animalType;

	if(req.body.animal.image === "" || req.body.animal.image === undefined){
		request(url, function(error, response, body){
			if(!error && response.statusCode == 200){
				var data = JSON.parse(body);
				imageUrl = data.urls.raw;
				req.body.animal.image = imageUrl;
				createAnimal(req, res);
			}
		});
	} else{
	createAnimal(req, res);
	
	}
});

//Show Route
app.get("/animals/:id", function(req, res){
	//show individual animal based off of id
	Animal.findById(req.params.id, function(err, animal){
		res.render("show", {animal:animal});
	});
});

//edit route
app.get("/animals/:id/edit", function(req, res){
	//find animal and render the edit form
	Animal.findById(req.params.id, function(err, animal){
		if(err){
			console.log(err);
		}else if(animal.birthday){
			
			var birthYear = animal.birthday.getFullYear().toString();
			var birthMonth = animal.birthday.getMonth() < 9 ? "0" + (animal.birthday.getMonth() +1) : animal.birthday.getMonth() +1;
			var birthDate = animal.birthday.getDate() <= 9 ? "0" + animal.birthday.getDate().toString(): animal.birthday.getDate().toString();
			var newBirthday =  birthYear + "-" + birthMonth + "-" + birthDate;
			
			res.render("edit", {animal:animal, birthday: newBirthday});
		} else {
			res.render("edit", {animal: animal, birthday: animal.birthday});
		}
	});
	
});

//update route
app.put("/animals/:id", function(req, res){
	req.body.animal.description = req.sanitize(req.body.animal.description);
	Animal.findByIdAndUpdate(req.params.id, req.body.animal,function(err, animal){
		if(err){
			console.log(err);
			res.redirect("/animals");
		} else{
			res.redirect("/animals");
		}
	});
});

//Destroy Route
app.delete("/animals/:id", function(req, res){
	//get animal, then destroy
	Animal.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log(err);
			res.redirect("/animals");
		} else {

			res.redirect("/animals");
		}
	});
});

//listener
app.listen(3000, function(){
	console.log("animal app is running");
});


function createAnimal(req, res){
	Animal.create(req.body.animal, function(err, animal){
		if(err){
			res.redirect("/animals");
			console.log(err);
		} else {
			//redirect to index route
			res.redirect("/animals");
		}
	});
}
