/**
 * Module dependencies.
 */

var createError  = require('http-errors');
var express      = require('express');
var path         = require('path');
var cookieParser = require('cookie-parser');
var logger       = require('morgan');
var app          = express();
var http         = require('http');
require('dotenv').config();

/**
 * import Router
 */

var loginRouter = require('./routes/login_router');
var HomeRouter  = require('./routes/home_router')
var apiRouter   = require('./routes/apiRouter');

/**
 * Mongodb connection
 */

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOOSE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

/**
 * Set up (view, parser)
 */

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Create HTTP server have socket io
 */

var server = http.createServer(app);

const io = require('socket.io')(server);
app.use(function (req, res, next) {
  req.io = io;
  next();
});

/**
 * Define Route
 */

app.use('/', loginRouter);
app.use('/home', HomeRouter);
app.use('/api', apiRouter);

/**
 * catch 404 and forward to error handler
 */

app.use(function (req, res, next) {
  next(createError(404));
});

/**
 * error handler
 */

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = server;
