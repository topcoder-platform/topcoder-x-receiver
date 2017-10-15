/*
 * Copyright (c) 2017 TopCoder, Inc. All rights reserved.
 */
/**
 * This module contains the schema of the CommentCreatedEvent.
 *
 * @author TCSCODER
 * @version 1.0
 */
'use strict';
const Joi = require('joi');
const {issueSchema, repositorySchema} = require('./common');

const CommentCreatedEvent = {
  name: 'comment.created'
};

CommentCreatedEvent.schema = Joi.object().keys({
  issue: issueSchema.required(),
  comment: Joi.object().keys({
    id: Joi.number().required(),
    body: Joi.string().allow(''),
    user: Joi.object().keys({
      id: Joi.number().required(),
      name: Joi.string().required()
    }).required()
  }),
  repository: repositorySchema.required()
});


module.exports = CommentCreatedEvent;

