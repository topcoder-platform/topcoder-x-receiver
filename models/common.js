/*
 * Copyright (c) 2017 TopCoder, Inc. All rights reserved.
 */

/**
 * This module contains some common schemas.
 *
 * @author TCSCODER
 * @version 1.0
 */

'use strict';

const Joi = require('joi');

// the repository schema
const repositorySchema = Joi.object().keys({
  id: Joi.number().required(),
  full_name: Joi.string().required()
});

// the issue schema
const issueSchema = Joi.object().keys({
  number: Joi.number().required(),
  title: Joi.string().required(),
  body: Joi.string().allow(''),
  labels: Joi.array().items(Joi.string()),
  assignees: Joi.array().items(Joi.object().keys({
    id: Joi.number().required(),
    name: Joi.string().required()
  })),
  owner: Joi.object().keys({
    id: Joi.number().required(),
    name: Joi.string().required()
  }).required()
});

// the pull request schema
const pullRequestSchema = Joi.object().keys({
  id: Joi.number().required(),
  merged: Joi.boolean().required(),
  number: Joi.number().required(),
  body: Joi.string().allow(''),
  title: Joi.string().required(),
  user: Joi.object().keys({
    id: Joi.number().required(),
    name: Joi.string().required()
  }),
  assignees: Joi.array().items({
    id: Joi.number().required(),
    name: Joi.string().required()
  })
});

module.exports = {
  issueSchema,
  pullRequestSchema,
  repositorySchema
};
