/*
 * Copyright (c) 2018 TopCoder, Inc. All rights reserved.
 */
/**
 * This module contains the schema of the LabelUpdatedEvent.
 *
 * @author TCSCODER
 * @version 1.0
 */
'use strict';
const Joi = require('joi');
const {issueSchema, repositorySchema} = require('./common');

const LabelUpdatedEvent = {
  name: 'issue.labelUpdated'
};

LabelUpdatedEvent.schema = Joi.object().keys({
  issue: issueSchema.required(),
  repository: repositorySchema.required(),
  labels: Joi.array().items(Joi.string()).required()
});

module.exports = LabelUpdatedEvent;
