const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const routes = require('./routes/routes.js');
var winston = require('winston');
var logger = require("./logger");
let app = express();
//app.set('port', process.env.PORT || 8080);

app.set('view engine', 'ejs');
app.set('views', __dirname + '/public/html');

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 
app.use(cookieParser()); 
app.use('/',routes);

app.listen(8080,function() {
    console.log('server started on port : ' + 8080);
});