var http = require("http");
var url = require("url");
var express = require("express");
var mu = require("mu2");
var fs = require("fs");
var app = express();

app.get('/',function(req,res){
	mu.clearCache();
	fs.exists('index.html', function(exists){
		if(exists) {
			var stream = mu.compileAndRender('index.html');
			stream.pipe(res);
		} else {
			res.writeHead(404);
			res.end("No existe");
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

app.use(express.static(__dirname + '/public'));
app.listen(process.env.PORT || 3000);
