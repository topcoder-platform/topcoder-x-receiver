/*
 * Copyright (c) 2017 TopCoder, Inc. All rights reserved.
 */
/**
 * This module is a wrapper for kafka producer.
 * Changes in 1.1:
 * - changes related to https://www.topcoder.com/challenges/30060466
 * @author TCSCODER
 * @version 1.1
 */
'use strict';

const config = require('config');
const kafka = require('no-kafka');
const logger = require('./logger');

class Kafka {
  constructor() {
    this.producer = new kafka.Producer(config.KAFKA_OPTIONS);
    this.producer.init().then(() => {
      logger.info('kafka producer is ready.');
    }).catch((err) => {
      logger.error(`kafka is not connected. ${err.stack}`);
    });
  }

  send(message) {
    return this.producer.send({topic: config.TOPIC, message: {value: message}});
  }
}

module.exports = new Kafka();
