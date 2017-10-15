/*
 * Copyright (c) 2017 TopCoder, Inc. All rights reserved.
 */
/**
 * This module contains the schema of the LabelAssignedEvent.
 *
 * @author TCSCODER
 * @version 1.0
 */
'use strict';
const Joi = require('joi');
const {issueSchema, repositorySchema} = require('./common');

const LabelAssignedEvent = {
  name: 'issue.labeled'
};

LabelAssignedEvent.schema = Joi.object().keys({
  issue: issueSchema.required(),
  repository: repositorySchema.required(),
  label: Joi.string().required()
});


module.exports = LabelAssignedEvent;

