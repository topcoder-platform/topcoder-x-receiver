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

module.exports = (provider) => async (req, res, next) => {
  let isValid = false;
  const params = req.body;
  if (provider === 'github') {
    const projectDetail = await Project.findOne({repoUrl: params.repository.html_url});
    const hash = crypto.createHmac('sha1', projectDetail.secretWebhookKey).update(req.rawBody).digest('hex');
    isValid = `sha1=${hash}` === req.header('X-Hub-Signature');
  } else if (provider === 'gitlab') {
    const projectDetail = await Project.findOne({repoUrl: params.project.web_url});
    isValid = projectDetail.secretWebhookKey === req.header('X-Gitlab-Token');
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
