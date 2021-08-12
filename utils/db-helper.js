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
    model.scan(scanParams).consistent().all().exec((err, result) => {
      if (err) {
        reject(err);
      }
      return resolve(result);
    });
  });
}

module.exports = {
  scan
};
