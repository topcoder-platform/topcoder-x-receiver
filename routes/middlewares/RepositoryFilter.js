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

const logger = require('../../utils/logger');
const Project = require('../../models').Project;

module.exports = (provider) => async (req, res, next) => {
  let repoNames = [];
  if (provider === 'github') {
    const repo = req.body.repository || {};
    repoNames = [repo.svn_url, repo.git_url, repo.ssh_url, repo.clone_url];
  } else if (provider === 'gitlab') {
    const repo = req.body.project || {};
    repoNames = [repo.homepage, repo.http_url, repo.url, repo.ssh_url, repo.web_url];
  }
  let found = false;
  const projects = await Project.find({archived: false});
  found = _.some(projects, (project) => _.includes(repoNames, project.repoUrl));
  if (found) {
    return next();
  }

  // ignore this repo
  logger.info(`Ignoring event from unwatched repo: ${repoNames[0]}`);
  logger.debug(`event info: ${JSON.stringify(req.body)}`);

  return res.json({success: true});
};
