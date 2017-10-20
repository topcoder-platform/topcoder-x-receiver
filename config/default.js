/*
 * Copyright (c) 2017 TopCoder, Inc. All rights reserved.
 */

/**
 * This module contains the configurations of the app.
 *
 * @author TCSCODER
 * @version 1.0
 */
'use strict';

module.exports = {
  PORT: process.env.PORT || 3000, // eslint-disable-line no-magic-numbers
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  TOPIC: process.env.TOPIC || 'events_topic',
  ZOO_KEEPER: process.env.ZOO_KEEPER || 'localhost:2181',
  GITHUB_SECRET_TOKEN: process.env.GITHUB_SECRET_TOKEN || '',
  GITLAB_SECRET_TOKEN: process.env.GITLAB_SECRET_TOKEN || '',
  WATCH_REPOS: [
    'https://github.com/cwdcwd/challengeFetcher'
  ]
};
