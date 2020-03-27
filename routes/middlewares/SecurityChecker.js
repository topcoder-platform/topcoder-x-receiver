/*
 * Copyright (c) 2017 TopCoder, Inc. All rights reserved.
 */
/**
 * This module is the middleware to checks the security token or signature.
 *
 * @author TCSCODER
 * @version 1.0
 */
'use strict';
const crypto = require('crypto');
const _ = require('lodash');
const logger = require('../../utils/logger');
const Project = require('../../models').Project;
const dbHelper = require('../../utils/db-helper');

module.exports = (provider) => async (req, res, next) => {
  let isValid = false;
  const params = req.body;
  if (provider === 'github') {
    const projectDetails = await dbHelper.scan(Project, {
      repoUrl: params.repository.html_url
    });
    _.forEach(projectDetails, (projectDetail) => {
      const hash = crypto.createHmac('sha1', projectDetail.secretWebhookKey).update(req.rawBody).digest('hex');
      if (`sha1=${hash}` === req.header('X-Hub-Signature')) {
        isValid = true;
      }
    });
  } else if (provider === 'gitlab') {
    const projectDetails = await dbHelper.scan(Project, {
      repoUrl: params.project.web_url
    });
    _.forEach(projectDetails, (projectDetail) => { // eslint-disable-line lodash/prefer-filter
      if (projectDetail.secretWebhookKey === req.header('X-Gitlab-Token')) {
        isValid = true;
      }
    });
  } else {
    // unknown provider
    return next();
  }

  if (!isValid) {
    logger.info('Invalid Security Check. Make sure you set the secret token in webhook.');
    const err = new Error('Invalid secret token');
    err.status = 400;
    return next(err);
  }
  return next();
};
