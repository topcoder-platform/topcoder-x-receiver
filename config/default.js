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
  KAFKA_OPTIONS: {
    connectionString: process.env.KAFKA_HOST || 'localhost:9092',
    ssl: {
      cert: process.env.KAFKA_CLIENT_CERT || fs.readFileSync('./kafka_client.cer'), // eslint-disable-line no-sync
      key: process.env.KAFKA_CLIENT_CERT_KEY || fs.readFileSync('./kafka_client.key') // eslint-disable-line no-sync
    }
  },
  MONGODB_URL: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/topcoderx'
};
