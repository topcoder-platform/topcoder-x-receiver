/*
 * Copyright (c) 2018 TopCoder, Inc. All rights reserved.
 */
'use strict';

/**
 * This module contains the database helper methods.
 *
 * @version 1.0
 */

/**
 * Get data collection by scan parameters
 * @param {Object} model The dynamoose model to scan
 * @param {Object} scanParams The scan parameters object
 * @returns {Promise<void>}
 */
async function scan(model, scanParams) {
  return await new Promise((resolve, reject) => {
    model.scan(scanParams).exec((err, result) => {
      if (err) {
        reject(err);
      }
      return resolve(result);
    });
  });
}

/**
 * Get single data by scan parameters
 * @param {Object} model The dynamoose model to scan
 * @param {Object} scanParams The scan parameters object
 * @returns {Promise<void>}
 */
async function scanOne(model, scanParams) {
  return await new Promise((resolve, reject) => {
    model.scan(scanParams).exec((err, result) => {
      if (err) {
        reject(err);
      }

      return resolve(result[0]);
    });
  });
}

module.exports = {
  scan,
  scanOne
};
