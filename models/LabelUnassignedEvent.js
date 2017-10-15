/*
 * Copyright (c) 2017 TopCoder, Inc. All rights reserved.
 */
/**
 * This module contains the schema of the LabelUnassignedEvent.
 *
 * @author TCSCODER
 * @version 1.0
 */
'use strict';
const Joi = require('joi');
const {issueSchema, repositorySchema} = require('./common');

const LabelUnassignedEvent = {
  name: 'issue.unlabeled'
};

LabelUnassignedEvent.schema = Joi.object().keys({
  issue: issueSchema.required(),
  repository: repositorySchema.required(),
  label: Joi.string().required()
});

module.exports = LabelUnassignedEvent;

