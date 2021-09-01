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

const logger = require('../../utils/logger');
const Repository = require('../../models').Repository;
const dbHelper = require('../../utils/db-helper');

module.exports = (provider) => async (req, res, next) => {
  let repoNames = [];
  if (provider === 'github') {
    const repo = req.body.repository || {};
    repoNames = [repo.svn_url, repo.git_url, repo.ssh_url, repo.clone_url];
  } else if (provider === 'gitlab') {
    const repo = req.body.project || {};
    repoNames = [repo.homepage, repo.http_url, repo.url, repo.ssh_url, repo.web_url];
  }
  for (const repoName of repoNames) { //eslint-disable-line
    if (await dbHelper.queryOneActiveRepository(Repository, repoName)) {
      return next();
    }
  }

  // ignore this repo
  logger.info(`Ignoring event from unwatched repo: ${repoNames[0]}`);
  logger.debug(`event info: ${JSON.stringify(req.body)}`);

  return res.json({success: true});
};
