/*
 * Copyright (c) 2017 TopCoder, Inc. All rights reserved.
 */
/**
 * This module contains the express middlewares for the whole app.
 *
 * @author TCSCODER
 * @version 1.0
 */
'use strict';
const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const webhooks = require('./routes/webhooks');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  }
}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/webhooks', webhooks);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.log(err);
  res.status(err.status || 500); // eslint-disable-line no-magic-numbers
  res.json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });
});

module.exports = app;
