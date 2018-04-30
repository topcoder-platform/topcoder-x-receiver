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
const config = require('config');
const logger = require('../../utils/logger');

module.exports = (provider) => (req, res, next) => {
  if (provider === 'github') {
    const hash = crypto.createHmac('sha1', config.GITHUB_SECRET_TOKEN).update(req.rawBody).digest('hex');
    if (`sha1=${hash}` !== req.header('X-Hub-Signature')) {
      logger.info('Invalid Security Check. Make sure you set the secret token in webhook.');
      const err = new Error('Invalid secret token');
      err.status = 400;
      return next(err);
    }
    return next();
  } else if (provider === 'gitlab') {
    if (config.GITLAB_SECRET_TOKEN !== req.header('X-Gitlab-Token')) {
      logger.info('Invalid Security Check. Make sure you set the secret token in webhook.');
      const err = new Error('Invalid secret token');
      err.status = 400;
      return next(err);
    }
    return next();
  }

  // unknown provider
  return next();
};
