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
// const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const healthcheck = require('topcoder-healthcheck-dropin');
const logger = require('./utils/logger');

/**
 * Method to check the service status
 * @returns {Object} The returned status
 */
function check() {
  // No checks to run. The output of this itself is an indication that the app is actively running
  return {
    checksRun: 1
  };
}

const webhooks = require('./routes/webhooks');

const app = express();

// app.use(logger('dev'));
app.use(bodyParser.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  }
}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(healthcheck.middleware([check]));

app.use('/webhooks', webhooks);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// // error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.log(err);
  res.status(err.status || 500); // eslint-disable-line no-magic-numbers
  res.json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });
});

process.on('uncaughtException', (err) => {
  // logger.error('Exception: ', err);
  // Check if error related to Dynamodb conn
  if (err.code === 'NetworkingError' && err.region) {
    logger.error('DynamoDB connection failed.');
  }
  logger.logFullError(err, 'system');
  // console.log(err);
});

// handle and log unhanled rejection
process.on('unhandledRejection', (err) => {
  // logger.error('Rejection: ', err);
  logger.logFullError(err, 'system');
  // console.log(err);
});

module.exports = app;
