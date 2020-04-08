/*
 * Copyright (c) 2018 TopCoder, Inc. All rights reserved.
 */
/**
 * This module contains the schema of the issue closed schema.
 *
 * @author veshu
 * @version 1.0
 */
'use strict';
const Joi = require('joi');
const {issueSchema, repositorySchema} = require('./common');

const IssueClosedEvent = {
  name: 'issue.closed',

  schema: Joi.object().keys({
    issue: issueSchema.required(),
    repository: repositorySchema.required(),
    assignee: Joi.object().keys({
      id: Joi.alternatives().try(Joi.string(), Joi.number()).allow(null)
    }).required()
  })
};


module.exports = IssueClosedEvent;

