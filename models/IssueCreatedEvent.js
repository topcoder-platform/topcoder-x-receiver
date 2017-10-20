/*
 * Copyright (c) 2017 TopCoder, Inc. All rights reserved.
 */

/**
 * This module contains the schema of the IssueCreatedEvent.
 *
 * @author TCSCODER
 * @version 1.0
 */
'use strict';
const Joi = require('joi');
const {issueSchema, repositorySchema} = require('./common');

const IssueCreatedEvent = {
  name: 'issue.created',

  schema: Joi.object().keys({
    issue: issueSchema.required(),
    repository: repositorySchema.required()
  })
};

module.exports = IssueCreatedEvent;

