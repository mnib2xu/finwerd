const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();
const hbs = require('hbs');
const mongoose = require('mongoose');
require('dotenv').config()

app.use(function(req,res,next) {
  if(req.headers["x-forwarded-proto"] == "http") {
      res.redirect("https://www.dexteradomini.com");
  } else {
      return next();
  }
});

// connect to mongoDB
mongoose
  .connect(process.env.DB_HOST || 'mongodb:27017/dextera', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + "/views/partials")
hbs.registerHelper('ifCond', function(v1, v2, options) {
  if(v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var indexRouter = require('./routes/index');
var peopleRouter = require('./routes/people');
var careerRouter = require('./routes/career');
var instituteRouter = require('./routes/institute');
var contactRouter = require('./routes/contact');
var thanksRouter = require('./routes/thanks');

app.use('/', indexRouter);
app.use('/people', peopleRouter);
app.use('/career', careerRouter);
app.use('/institute', instituteRouter);
app.use('/contact', contactRouter);
app.use('/thanks', thanksRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
