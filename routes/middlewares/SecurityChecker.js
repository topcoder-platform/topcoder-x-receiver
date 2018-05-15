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
  let isValid = false;
  if (provider === 'github') {
    const hash = crypto.createHmac('sha1', config.WEBHOOK_SECRET_TOKEN).update(req.rawBody).digest('hex');
    isValid = `sha1=${hash}` === req.header('X-Hub-Signature');
  } else if (provider === 'gitlab') {
    isValid = config.WEBHOOK_SECRET_TOKEN === req.header('X-Gitlab-Token');
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
