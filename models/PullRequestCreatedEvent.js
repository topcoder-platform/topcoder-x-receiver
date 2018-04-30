/*
 * Copyright (c) 2017 TopCoder, Inc. All rights reserved.
 */
/**
 * This module contains the schema of the PullRequestCreatedEvent.
 *
 * @author TCSCODER
 * @version 1.0
 */
'use strict';
const Joi = require('joi');
const {pullRequestSchema, repositorySchema} = require('./common');

const PullRequestCreatedEvent = {
  name: 'pull_request.created'
};

PullRequestCreatedEvent.schema = Joi.object().keys({
  pull_request: pullRequestSchema.required(),
  repository: repositorySchema.required()
});

module.exports = PullRequestCreatedEvent;

