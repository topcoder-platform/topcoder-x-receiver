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
const logger = require('../../utils/logger');
const Project = require('../../models').Project;
const Repository = require('../../models').Repository;
const dbHelper = require('../../utils/db-helper');

module.exports = (provider) => async (req, res, next) => {
  let isValid = false;
  const params = req.body;
  if (provider === 'github') {
    const repositories = await dbHelper.queryRepositories(Repository, params.repository.html_url);
    for (const repository of repositories) {  // eslint-disable-line
      const projectDetail = await dbHelper.queryOneProject(Project, repository.projectId);
      const hash = crypto.createHmac('sha1', projectDetail.secretWebhookKey).update(req.rawBody).digest('hex');
      if (`sha1=${hash}` === req.header('X-Hub-Signature')) {
        isValid = true;
      }
    }
  } else if (provider === 'gitlab') {
    const repositories = await dbHelper.queryRepositories(Repository, params.project.web_url);
    for (const repository of repositories) {  // eslint-disable-line
      const projectDetail = await dbHelper.queryOneProject(Project, repository.projectId);
      if (projectDetail.secretWebhookKey === req.header('X-Gitlab-Token')) {
        isValid = true;
      }
    }
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
