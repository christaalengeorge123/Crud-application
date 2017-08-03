var express = require('express');
var app = express();
//var mongojs = require('mongojs');
//var db = mongojs('contactlist', ['contactlist']);
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/contactlist');
var ContactSchema = new mongoose.Schema({
  	name : String,
	email : String,
	number : String
});
var  contactlist = mongoose.model('contactlist', ContactSchema, 'contactlist');
var cookieParser = require('cookie-parser');





app.use(express.static(__dirname + '/public'));

app.use(cookieParser());

app.get('/', function(req, res){
   res.cookie('name', 'express').send('cookie set'); //Sets name = express
});



app.get('/contactlist', function (req, res) {
  console.log('I received a GET request');

  console.log('Cookies: ', req.cookies);

  contactlist.find(function (err, docs) {
    console.log(docs);
    res.json(docs);
  });
});

app.post('/contactlist', function (req, res) {
  var pl = new contactlist(req.body);
	pl.save(function(err,data){
		console.log(pl);
		res.json(data);
	});
});

app.delete('/contactlist/:id', function (req, res) {
  contactlist.findByIdAndRemove(req.params.id, function(err, response){
      if(err) res.json({message: "Error in deleting record id " + req.params.id});
      else res.json({message: "Person with id " + req.params.id + " removed."});
   });
});

app.get('/contactlist/:id', function (req, res) {
  var id = req.params.id;
  console.log(id);
 contactlist.findOne({_id: req.params.id}, function (err, doc) {
    res.json(doc);
  });
});

app.put('/contactlist/:id', function (req, res) {
 contactlist.findOneAndUpdate({
    _id: req.params.id
},
 {$set: {name: req.body.name, email: req.body.email, number: req.body.number}},
    {upsert: true}, function (err, doc) {
      res.json(doc);
    }
  );
});

var fs  = require('fs');
  buf = new Buffer(256);
  var data = 'New file created';
  len = buf.write('New file created');
  var writerStream = fs.createWriteStream('fooditems.txt');

  writerStream.write(data,'UTF8');
  console.log(len);

  writerStream.end();

  writerStream.on('finish', function() {
    console.log("Write completed.");
});

writerStream.on('error', function(err){
   console.log(err.stack);
});


app.listen(3000);
console.log("Server running on port 3000");
