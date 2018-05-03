'use strict';
const fs = require('fs');

/*
 * Copyright (c) 2017 TopCoder, Inc. All rights reserved.
 */

/**
 * This module contains the configurations of the app.
 * Changes in 1.1:
 * - changes related to https://www.topcoder.com/challenges/30060466
 * @author TCSCODER
 * @version 1.1
 */

module.exports = {
  PORT: process.env.PORT || 3002, // eslint-disable-line no-magic-numbers
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  TOPIC: process.env.TOPIC || 'tc-x-events',
  GITHUB_SECRET_TOKEN: process.env.GITHUB_SECRET_TOKEN || 'ghostar',
  GITLAB_SECRET_TOKEN: process.env.GITLAB_SECRET_TOKEN || 'ghostar',
  KAFKA_OPTIONS: {
    kafkaHost: process.env.KAFKA_HOST || 'localhost:9092',
    sslOptions: {
      cert: process.env.KAFKA_CLIENT_CERT || fs.readFileSync('./kafka_client.cer'),
      key: process.env.KAFKA_CLIENT_CERT_KEY || fs.readFileSync('./kafka_client.key')
   }
  },
  MONGODB_URL: process.env.MONGODB_URI || 'mongodb://heroku_mx614sjn:4lndgg69o9t6qbrvob8o859e4o@ds141464.mlab.com:41464/heroku_mx614sjn'
};
