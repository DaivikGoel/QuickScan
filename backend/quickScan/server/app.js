var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const serviceAccount = require('./config/serviceAccountKey.json');
const db = require('./queries');


var express  = require('express');
var app      = express();
var aws      = require('aws-sdk');
var queueUrl = "https://sqs.ca-central-1.amazonaws.com/861570318875/3DObjectQueue.fifo";
var receipt  = "";

aws.config.update({region:'ca-central-1'})
var sqs = new aws.SQS()

var counter = 0

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

var app = express();

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let authorized = true

function checkAuth(req, res, next) {
  if (req.headers.authtoken) {
    admin.auth().verifyIdToken(req.headers.authtoken)
      .then(() => {
        next()
      }).catch(() => {
        res.status(403).send('Unauthorized')
      });
  } else {
    res.status(403).send('Unauthorized')
  }
}

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.use('/', checkAuth)

app.post('/collection', db.createCollection)
app.get('/', (req, res) => {
  res.json({
    message: 'Hello World!'
  })
})

app.get('/sendToQueue', function (req, res) {
  counter++;
  var params = {
      MessageGroupId: "0",
      MessageBody: 'queue message ' + counter,
      QueueUrl: queueUrl,
      DelaySeconds: 0
  };

  sqs.sendMessage(params, function(err, data) {
      if(err) {
          res.send(err);
      }
      else {
          res.send(data);
      }
  });
});

module.exports = app;
