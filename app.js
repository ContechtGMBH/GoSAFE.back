var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var morgan = require('morgan');
var multer = require('multer')
const fileUpload = require('express-fileupload');

var app = express();


//app.use(logger('dev'));
app.use(morgan('dev'));
app.use(bodyParser.json({limit: '10mb'}));
app.use(fileUpload());
//app.use(bodyParser.urlencoded({ extended: false }));


app.use(cookieParser());
app.use(cors());

require('./routes.js')(app);

app.use(express.static(path.join(__dirname, 'tiles')))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
