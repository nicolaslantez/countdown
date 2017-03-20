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
				} else {
					mu.clearCache();
					fs.exists('index.html', function(exists){
						if(exists) {
							for(element in result){
								if(result[element].EstimatedDate != null){
									var date = new Date(result[element].EstimatedDate);
									var month = date .getMonth() + 1;
		    						var month = (month < 10) ? '0' + month : month;
		    						var day = date .getDate();
		    						var year = date .getFullYear();
		    						date = month + "-" + day + "-" + year;
		    						result[element].EstimatedDate = date;
								} else {
									result[element].EstimatedDate = "";
								}
							}
							var stream = mu.compileAndRender('index.html',{results : result});
							stream.pipe(res);
						} else {
							res.writeHead(404);
							res.end("No existe");
						}
					});
				}
				db.close();
			});
		}
	});

});

app.get('/newEntry', function(req,res){
	var MongoClient = mongodb.MongoClient;
	var url = 'mongodb://localhost:27017/countdownSite';
	MongoClient.connect(url, function(err, db){
		if(err) {
			console.log('Unable to connect to the server', err);
		} else {
			console.log('Conection established');
			var collection = db.collection('entries');
			collection.find({}).toArray(function(err, result){
				if(err){
					res.send(err);
				} else {
					mu.clearCache();
					fs.exists('newEntry.html', function(exists){
						if(exists) {
							var issueID;
							if(result.length) { issueID = 'Vuln' + result.length; }
							else{ issueID = 'Vuln0'; }
							var stream = mu.compileAndRender('newEntry.html', {IssueID : issueID});
							stream.pipe(res);
						} else {
							res.writeHead(404);
							res.end("No existe");
						}
					});
				}
				db.close();
			});
		}
	});
});


app.get('/pings',function(req,res){
	var MongoClient = mongodb.MongoClient;
	var url = 'mongodb://localhost:27017/countdownSite';

	MongoClient.connect(url, function(err, db){
		if(err){
			console.log('Unable to connect to the server', err);
		} else {
			console.log('Conection established');
			var collection = db.collection('entries');
			var date = new Date();
			collection.find({Status : "Pendiente", EstimatedDate : {$lte : date}}).toArray(function(err, result){
				if(err){
					res.send(err);
				} else {
					mu.clearCache();
					fs.exists('index.html', function(exists){
						if(exists) {
							for(element in result){
								var date = new Date(result[element].EstimatedDate);
								var month = date .getMonth() + 1;
	    						var month = (month < 10) ? '0' + month : month;
	    						var day = date .getDate();
	    						var year = date .getFullYear();
	    						date = month + "-" + day + "-" + year;
	    						result[element].EstimatedDate = date;
							}
							var stream = mu.compileAndRender('index.html',{results : result});
							stream.pipe(res);
						} else {
							res.writeHead(404);
							res.end("No existe");
						}
					});
				}
				db.close();
			});
		}
	});
});

app.get('/:issueID', function(req,res){
	var MongoClient = mongodb.MongoClient;
	var url = 'mongodb://localhost:27017/countdownSite';
	MongoClient.connect(url, function(err, db){
		if(err) {
			console.log('Unable to connect to the server', err);
		} else {
			console.log('Conection established');
			var collection = db.collection('entries');
			collection.find({IssueID : req.params.issueID}).toArray(function(err, result){
				if(err){
					res.send(err);
				} else if(result.length) {
					mu.clearCache();
					fs.exists('edit.html', function(exists){
						if(exists) {
							var stream = mu.compileAndRender('edit.html', {vuln : result});
							stream.pipe(res);
						} else {
							res.writeHead(404);
							res.end("No existe");
						}
					});
				} else {
					res.send('Something was wrong. Please reload');
				}
				db.close();
			});
		}
	});
});

app.post('/addEntry', function(req,res){
	var MongoClient = mongodb.MongoClient;
	var url = 'mongodb://localhost:27017/countdownSite';

	MongoClient.connect(url, function(err, db){
		if(err){
			console.log('Unable to connect to the server', err);
		} else {
			console.log('Conection established');
			var collection = db.collection('entries');
			var date;
			var date = (!req.body.EstimatedDate) ? date = null : date = new Date(req.body.EstimatedDate);
			console.log(date);
			var newEntry = {Date: req.body.Date, IssueID : req.body.IssueID, VulnName : req.body.VulnName, TreatmentDate : req.body.TreatmentDate, WebSecResponsible : req.body.WebSecResponsible, DesaResponsible : req.body.DesaResponsible, DesaProject : req.body.DesaProject, Status : req.body.Status, EstimatedDate : date, Comments : req.body.Comments};
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

app.post('/editEntry', function(req,res){
	var MongoClient = mongodb.MongoClient;
	var url = 'mongodb://localhost:27017/countdownSite';

	MongoClient.connect(url, function(err, db){
		if(err){
			console.log('Unable to connect to the server', err);
		} else {
			console.log('Conection established');
			var collection = db.collection('entries');
			collection.update({IssueID : req.body.IssueID},{$set : {
				"Date" : req.body.Date,
				"VulnName" : req.body.VulnName,
				"TreatmentDate" : req.body.TreatmentDate,
				"WebSecResponsible" : req.body.WebSecResponsible,
				"DesaResponsible" : req.body.DesaResponsible,
				"DesaProject" : req.body.DesaProject,
				"Status" : req.body.Status,
				"EstimatedDate" : req.body.EstimatedDate,
				"Comments" : req.body.Comments
			}});
			console.log("Entry updated");
			res.redirect('/');
		}
		db.close();
	});	
});

app.use(express.static(__dirname + '/public'));
app.listen(process.env.PORT || 3000);
