/*
 * Copyright (c) 2017 TopCoder, Inc. All rights reserved.
 */

/**
 * This module contains the winston logger configuration.
 *
 * @author TCSCODER
 * @version 1.0
 */
'use strict';
const config = require('config');
const util = require('util');
const _ = require('lodash');
const winston = require('winston');
const getParams = require('get-parameter-names');
const globalLog = require('global-request-logger');

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: config.LOG_LEVEL
    })
  ]
});

/**
 * Log error details with signature
 * @param {Error} err the error
 * @param {String} signature the signature
 */
logger.logFullError = function logFullError(err, signature) {
  if (!err || err.logged) {
    return;
  }
  logger.error(`Error happened in ${signature}\n${err.stack}`);
  err.logged = true;
};

/**
 * Remove invalid properties from the object and hide long arrays
 * @param {Object} obj the object
 * @returns {Object} the new object with removed properties
 * @private
 */
function sanitizeObject(obj) {
  try {
    return JSON.parse(JSON.stringify(obj, (name, value) => {
      // Array of field names that should not be logged
      const removeFields = ['refreshToken', 'accessToken', 'access_token', 'authorization'];
      if (_.includes(removeFields, name)) {
        return '<removed>';
      }
      if (_.isArray(value) && value.length > 30) { // eslint-disable-line
        return `Array(${value.length}`;
      }
      return value;
    }));
  } catch (e) {
    return obj;
  }
}

/**
 * Convert array with arguments to object
 * @param {Array} params the name of parameters
 * @param {Array} arr the array with values
 * @returns {Object} converted object
 * @private
 */
function combineObject(params, arr) {
  const ret = {};
  _.forEach(arr, (arg, i) => {
    ret[params[i]] = arg;
  });
  return ret;
}

/**
 * Decorate all functions of a service and log debug information if DEBUG is enabled
 * @param {Object} service the service
 */
logger.decorateWithLogging = function decorateWithLogging(service) {
  if (config.LOG_LEVEL !== 'debug') {
    return;
  }
  _.forEach(service, (method, name) => {
    const params = method.params || getParams(method);
    service[name] = async function serviceMethodWithLogging() {
      logger.debug(`ENTER ${name}`);
      logger.debug('input arguments');
      const args = Array.prototype.slice.call(arguments); // eslint-disable-line
      logger.debug(util.inspect(sanitizeObject(combineObject(params, args))));
      try {
        const result = await method.apply(this, arguments); // eslint-disable-line
        logger.debug(`EXIT ${name}`);
        logger.debug('output arguments');
        logger.debug(util.inspect(sanitizeObject(result)));
        return result;
      } catch (e) {
        logger.logFullError(e, name);
        throw e;
      }
    };
  });
};

/**
 * Apply logger and validation decorators
 * @param {Object} service the service to wrap
 */
logger.buildService = function buildService(service) {
  logger.decorateWithLogging(service);
};

// globalLog.initialize();

// global any http success request interceptor
globalLog.on('success', (request, response) => {
  logger.debug('Request', util.inspect(sanitizeObject(request)));
  logger.debug('Response', util.inspect(sanitizeObject(response)));
});

// global any http error request interceptor
globalLog.on('error', (request, response) => {
  logger.error('Request', util.inspect(sanitizeObject(request)));
  logger.error('Response', util.inspect(sanitizeObject(response)));
});

module.exports = logger;
