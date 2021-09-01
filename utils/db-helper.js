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

/**
 * Query active repositories
 * @param {Object} model the dynamoose model
 * @param {String} url the repository url
 * @returns {Promise<Object>}
 */
async function queryRepositories(model, url) {
  return await new Promise((resolve, reject) => {
    model.query({
      url
    })
    .all()
    .exec((err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
}

/**
 * Query one active repository
 * @param {Object} model the dynamoose model
 * @param {String} url the repository url
 * @returns {Promise<Object>}
 */
async function queryOneActiveRepository(model, url) {
  return await new Promise((resolve, reject) => {
    model.queryOne({
      url,
      archived: 'false'
    })
    .all()
    .exec((err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
}

/**
 * Query one project
 * @param {Object} model the dynamoose model
 * @param {String} projectId the project id
 * @returns {Promise<Object>}
 */
async function queryOneProject(model, projectId) {
  return await new Promise((resolve, reject) => {
    model.queryOne('id')
      .eq(projectId)
      .all()
      .exec((err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      });
  });
}

module.exports = {
  scan,
  queryRepositories,
  queryOneActiveRepository,
  queryOneProject
};
