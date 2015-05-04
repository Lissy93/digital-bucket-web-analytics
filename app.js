var braintree = require('braintree');
var express = require('express');
var jade = require('jade');
var lessMiddleware = require('less-middleware');
var gm = require('googlemaps');
var util = require('util');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var app = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(lessMiddleware(__dirname + '/public'));
app.set('views', __dirname + '/views')
app.set('view engine', 'jade');


mongoose.connect('mongodb://as-op-gm:asopgmbh2015@ds041327.mongolab.com:41327/digital-bucket');
var DigitalBucket = new mongoose.Schema({
  id: String,
  lat: String,
  long: String,
  time: String,
  bucket: String,
  amount: String,
  updated_at: { type: Date, default: Date.now }
});
DigitalBucketModel = mongoose.model('DigitalBucket', DigitalBucket);


app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));


app.get('/', function (req, res) {
  res.render('index',
      { title : 'Home' }
  )
});





app.post('/insert', function (req, res){
  var entry;
  console.log("POST: ");
  console.log(req.body);
  entry = new DigitalBucketModel({
    id: req.body.id,
    lat: req.body.lat,
    long: req.body.long,
    time: req.body.time,
    bucket: req.body.bucket,
    amount: req.body.amount
  });
  entry.save(function (err) {
    if (!err) {
      return console.log("created");
    } else {
      return console.log(err);
    }
  });
  return res.send(entry);
});





//app.get('/read', function(req, res, next) {
//  DigitalBucket.find(function (err, entries) {
//    if (err) return next(err);
//    res.json(entries);
//  });
//});




app.get('/map', function (req, res) {
  //
  //DigitalBucket.find(function (err, entries) {
  //  res.json(entries);
  //});

  // NAME | LAT | LON | SIZE | AMOUNT | DATE FROM | DATE TO
  res.locals.docsJSON = [
    ['London Eye, London', 51.503454,-0.119562, 20, 40.78, 1429959600, 1430028423 ],
    ['Palace of Westminster, London', 51.499633,-0.124755, 40, 78.43, 1429959600, 1430028423 ],
    ['Liverpool St', 51.5118534,-0.0807282, 100, 205.60, 1429959600, 1430028423 ],
    ['St Pauls', 51.515003,-0.0980554, 80, 155.00, 1429959600, 1430028423 ],
    ['Tower Gateway', 51.5106815,-0.0746772, 60, 122.10, 1429959600, 1430028423 ],
    ['Bank', 51.5134965,-0.0893642, 20, 41.00, 1429959600, 1430028423 ],
    ['Monument', 51.510694,-0.0860355, 30, 59.60, 1429959600, 1430028423 ],
    ['Temple', 51.511004,-0.1143764, 50, 102.90, 1429959600, 1430028423 ],
    ['Southwark', 51.5038352,-0.1048406, 60, 124.50, 1429959600, 1430028423 ],
    ['London Bridge', 51.5057362,-0.0887738, 30, 59.10, 1429959600, 1430028423 ],
    ['Blackfriars', 51.5152185,-0.0919721, 50, 105.20, 1429959600, 1430028423 ]
  ];

  res.render('map',
      { title : 'Map' }
  )
});


app.get('/analytics', function (req, res) {
  res.render('analytics',
      { title : 'Analytics' }
  )
});


app.get('/time', function (req, res) {
  res.render('time',
      { title : 'Time of Day Trends' }
  )
});

app.get('/settings', function (req, res) {
  res.render('settings',
      { title : 'Settings' }
  )
});




var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "pyn6cjks6px42qvq",
  publicKey: "z6hpx9tbk6s24ppk",
  privateKey: "7e0924f3c7dcf557b82f003084f7f660"
});

app.get("/client_token", function (req, res) {
  gateway.clientToken.generate({}, function (err, response) {
    res.send(response.clientToken);
  });
});


app.post("/purchases", function (req, res) {
  var nonce = req.param('payment_method_nonce');
  gateway.transaction.sale({
    amount: "5.00",
    paymentMethodNonce: braintree.Test.Nonces.Transactable
  }, function (err, result) {
    res.send(result);
  });
});




app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
});

