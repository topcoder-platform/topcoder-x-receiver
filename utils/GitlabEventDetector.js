/*
 * Copyright (c) 2017 TopCoder, Inc. All rights reserved.
 */

/**
 * This module contains the EventDetector for gitlab.
 *
 * @author TCSCODER
 * @version 1.0
 */
'use strict';

const Joi = require('joi');
const _ = require('lodash');

const models = require('../models');
const EventDetector = require('./EventDetector');

const parseIssue = (data) => ({
  number: data.object_attributes.id,
  body: data.object_attributes.title,
  title: data.object_attributes.description,
  labels: _.map(data.labels, 'title'),
  assignees: _.map(data.assignees, (assignee) => ({
    id: 0,
    name: assignee.name
  })),
  owner: {
    id: 0,
    name: data.user.name
  }
});

const parseRepository = (repository) => ({
  id: 0,
  full_name: repository.name
});


// begin the IssueCreatedEvent
const IssueCreatedEvent = {
  event: models.IssueCreatedEvent
};

IssueCreatedEvent.schema = Joi.object().keys({
  object_kind: Joi.string().valid('issue').required(),
  object_attributes: Joi.object().keys({
    state: Joi.string().valid('opened').required()
  }).required(),
  repository: Joi.object().required()
});

IssueCreatedEvent.parse = (data) => ({
  issue: parseIssue(data),
  repository: parseRepository(data.repository)
});

// end the IssueCreatedEvent

module.exports = new EventDetector('gitlab', [
  IssueCreatedEvent
]);
