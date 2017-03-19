var http = require("http");
var url = require("url");
var express = require("express");
var bodyParser = require("body-parser");
var mu = require("mu2");
var fs = require("fs");
var app = express();
var mongodb = require("mongodb");

app.use(bodyParser.urlencoded());

app.get('/',function(req,res){
	var MongoClient = mongodb.MongoClient;
	var url = 'mongodb://localhost:27017/countdownSite';

	MongoClient.connect(url, function(err, db){
		if(err){
			console.log('Unable to connect to the server', err);
		} else {
			console.log('Conection established');
			var collection = db.collection('entries');
			collection.find({}).toArray(function(err, result){
				if(err){
					res.send(err);
				} else if(result.length) {
					mu.clearCache();
					fs.exists('index.html', function(exists){
						if(exists) {
							var stream = mu.compileAndRender('index.html',{results : result});
							stream.pipe(res);
						} else {
							res.writeHead(404);
							res.end("No existe");
						}
					});
				} else {
					res.send('No documents found');
				}
				db.close();
			});
		}
	});

});

app.get('/newEntry', function(req,res){
	mu.clearCache();
	fs.exists('newEntry.html', function(exists){
		if(exists) {
			var stream = mu.compileAndRender('newEntry.html');
			stream.pipe(res);
		} else {
			res.writeHead(404);
			res.end("No existe");
		}
	});
});

app.post('/addEntry', function(req,res){
	console.log("ME LLAMANNNNN")
	var MongoClient = mongodb.MongoClient;
	var url = 'mongodb://localhost:27017/countdownSite';

	MongoClient.connect(url, function(err, db){
		if(err){
			console.log('Unable to connect to the server', err);
		} else {
			console.log(req.body);
			console.log('Conection established');
			var collection = db.collection('entries');
			var newEntry = {Date: req.body.Date, IssueID : req.body.IssueID, VulnName : req.body.VulnName, TreatmentDate : req.body.TreatmentDate, WebSecResponsible : req.body.WebSecResponsible, DesaResponsible : req.body.DesaResponsible, DesaProyect : req.body.DesaProyect, Status : req.body.Status, EstimatedDate : req.body.EstimatedDate, Comments : req.body.Comments};
			collection.insert([newEntry], function(err, result){
			if(err) {
				console.log(err);
			} else {
				res.redirect("/");
				}
			});
		}
		db.close();
	});	
});

app.use(express.static(__dirname + '/public'));
app.listen(process.env.PORT || 3000);
