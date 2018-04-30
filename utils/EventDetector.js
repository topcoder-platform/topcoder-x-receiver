/*
 * Copyright (c) 2017 TopCoder, Inc. All rights reserved.
 */
/**
 * This module contains the EventDetector.
 *
 * @author TCSCODER
 * @version 1.0
 */
'use strict';

const Joi = require('joi');
const _ = require('lodash');

class EventDetector {

  /**
   * The constructor.
   * @param {string} provider the provider. i.e, gitlab or github
   * @param {array} events the events to watch
   */
  constructor(provider, events) {
    this.provider = provider;
    this.events = events;
  }

  /**
   * Detects if the data is an event.
   * @param {object} data the event data.
   * @returns {object} the converted event data or null (not an event).
   */
  detect(data) {
    let foundEvent = null;
    let eventObject = null;
    _.forEach(this.events, (e) => {
      let result = Joi.validate(data, e.schema, {stripUnknown: true});
      if (result.error) {
        return;
      }
      const obj = e.parse(data);
      // validate
      result = Joi.attempt(obj, e.event.schema);
      if (result.error) {
        throw result.error;
      }
      // done
      foundEvent = e;
      eventObject = obj;
    });

    if (foundEvent && eventObject) {
      return {
        event: foundEvent.event.name,
        provider: this.provider,
        data: eventObject
      };
    }
    return null;
  }
}

module.exports = EventDetector;

