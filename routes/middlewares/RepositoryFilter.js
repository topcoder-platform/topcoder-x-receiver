/*
 * Copyright (c) 2017 TopCoder, Inc. All rights reserved.
 */
/**
 * This module is the middleware to filter the repos that we don't want to watch.
 *
 * @author TCSCODER
 * @version 1.0
 */
'use strict';
const _ = require('lodash');
const config = require('config');

const logger = require('../../utils/logger');

module.exports = (provider) => (req, res, next) => {
  let repoNames = [];
  if (provider === 'github') {
    const repo = req.body.repository || {};
    repoNames = [repo.svn_url, repo.git_url, repo.ssh_url, repo.clone_url];
  } else if (provider === 'gitlab') {
    const repo = req.body.repository || {};
    repoNames = [repo.homepage, repo.http_url, repo.url, repo.ssh_url];
  }
  let found = false;
  _.forEach(repoNames, (r) => {
    _.forEach(config.WATCH_REPOS, (wr) => {
      if (wr === r) {
        found = true;
      }
    });
  });

  if (found) {
    return next();
  }

  // ignore this repo
  logger.info(`Ignoring event from unwatched repo: ${repoNames[0]}`);
  logger.debug(`event info: ${JSON.stringify(req.body)}`);

  return res.json({success: true});
};
