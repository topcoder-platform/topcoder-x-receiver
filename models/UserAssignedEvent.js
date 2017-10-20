/*
 * Copyright (c) 2017 TopCoder, Inc. All rights reserved.
 */
/**
 * This module contains the schema of the UserAssignedEvent.
 *
 * @author TCSCODER
 * @version 1.0
 */
'use strict';
const Joi = require('joi');
const {issueSchema, repositorySchema} = require('./common');

const UserAssignedEvent = {
  name: 'issue.assigned'
};

UserAssignedEvent.schema = Joi.object().keys({
  issue: issueSchema.required(),
  repository: repositorySchema.required(),
  assignee: Joi.object().keys({
    id: Joi.number().required(),
    name: Joi.string().required()
  }).required()
});


module.exports = UserAssignedEvent;

