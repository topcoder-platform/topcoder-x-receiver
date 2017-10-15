/*
 * Copyright (c) 2017 TopCoder, Inc. All rights reserved.
 */
/**
 * This module contains the schema of the UserUnassignedEvent.
 *
 * @author TCSCODER
 * @version 1.0
 */
'use strict';
const Joi = require('joi');
const {issueSchema, repositorySchema} = require('./common');

const UserUnassignedEvent = {
  name: 'issue.unassigned'
};

UserUnassignedEvent.schema = Joi.object().keys({
  issue: issueSchema.required(),
  repository: repositorySchema.required(),
  assignee: Joi.object().keys({
    id: Joi.number().required(),
    name: Joi.string().required()
  }).required()
});

module.exports = UserUnassignedEvent;

