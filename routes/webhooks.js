/*
 * Copyright (c) 2017 TopCoder, Inc. All rights reserved.
 */
/**
 * This module is the routes for gitlab and github webhook handlers.
 *
 * @author TCSCODER
 * @version 1.0
 */
'use strict';

const express = require('express');
const logger = require('../utils/logger');
const kafka = require('../utils/kafka');
const GithubEventDetector = require('../utils/GithubEventDetector');
const GitlabEventDetector = require('../utils/GitlabEventDetector');

const RepositoryFilter = require('./middlewares/RepositoryFilter');
const SecurityChecker = require('./middlewares/SecurityChecker');
const wrapper = require('./middlewares/AsyncWrapper');

const router = express.Router();

router.post('/github', SecurityChecker('github'), RepositoryFilter('github'), wrapper(async (req, res) => {
  const result = GithubEventDetector.detect(req.body);
  if (!result) {
    logger.info('unknown event detected');
    logger.debug(req.body);
  } else {
    await kafka.send(JSON.stringify(result));
    logger.info(`successfully add event: ${result.event} to kafka queue`);
    logger.debug(`kafka message: ${JSON.stringify(result)}`);
  }
  res.json({success: true});
}));

router.post('/gitlab', SecurityChecker('gitlab'), RepositoryFilter('gitlab'), wrapper(async (req, res) => {
  const result = GitlabEventDetector.detect(req.body);
  if (!result) {
    logger.info('unknown event detected');
    logger.debug(req.body);
  } else {
    await kafka.send(JSON.stringify(result));
    logger.info(`successfully add event: ${result.event} to kafka queue`);
    logger.debug(`kafka message: ${JSON.stringify(result)}`);
  }
  res.json({success: true});
}));

module.exports = router;
