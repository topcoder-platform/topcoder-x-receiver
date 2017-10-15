/*
 * Copyright (c) 2017 TopCoder, Inc. All rights reserved.
 */
/**
 * This module contains the schema of the PullRequestClosedEvent.
 *
 * @author TCSCODER
 * @version 1.0
 */
'use strict';
const Joi = require('joi');
const {pullRequestSchema, repositorySchema} = require('./common');

const PullRequestClosedEvent = {
  name: 'pull_request.closed'
};

PullRequestClosedEvent.schema = Joi.object().keys({
  pull_request: pullRequestSchema.required(),
  repository: repositorySchema.required()
});

module.exports = PullRequestClosedEvent;

