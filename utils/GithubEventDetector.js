/*
 * Copyright (c) 2017 TopCoder, Inc. All rights reserved.
 */

/**
 * This module contains the EventDetector for github.
 * Changes in 1.1:
 * - changes related to https://www.topcoder.com/challenges/30060466
 * @author TCSCODER
 * @version 1.1
 */
'use strict';

const Joi = require('joi');
const _ = require('lodash');

const models = require('../models');
const EventDetector = require('./EventDetector');

/**
 * parse the issues from github webhook payload
 * @param {object} issue the github issue payload
 * @returns {object} the parsed issue detail
 */
const parseIssue = (issue) => ({
  number: issue.number,
  body: issue.body,
  title: issue.title,
  labels: _.map(issue.labels, 'name'),
  assignees: _.map(issue.assignees, (assignee) => ({
    id: assignee.id
  })),
  owner: {
    id: issue.user.id
  }
});

/**
 * parse the repository from github webhook payload
 * @param {object} repository the github webhook repository payload
 * @returns {object} the parsed repository detail
 */
const parseRepository = (repository) => ({
  id: repository.id,
  name: repository.name,
  full_name: repository.full_name
});

/**
 * parse the pull request from github webhok payload
 * @param {object} data the github webhook payload
 * @returns {object} the parsed pull request detail
 */
const parsePullRequest = (data) => ({
  number: data.number,
  id: data.pull_request.id,
  merged: data.pull_request.merged,
  body: data.pull_request.body,
  title: data.pull_request.title,
  user: {
    id: data.pull_request.user.id
  },
  assignees: _.map(data.pull_request.assignees, (a) => ({
    id: a.id
  }))
});

/**
 * parse the comment from github webhook payload
 * @param {object} data the github webhook payload
 * @returns {object} the parsed comment detail
 */
const parseComment = (data) => ({
  issue: parseIssue(data.issue),
  repository: parseRepository(data.repository),
  comment: {
    id: data.comment.id,
    body: data.comment.body,
    user: {
      id: data.comment.user.id
    }
  }
});

// definition of issue created event
const IssueCreatedEvent = {
  event: models.IssueCreatedEvent,
  schema: Joi.object().keys({
    action: Joi.string().valid('opened').required(),
    issue: Joi.object().required(),
    repository: Joi.object().required()
  }),
  parse: (data) => ({
    issue: parseIssue(data.issue),
    repository: parseRepository(data.repository)
  })
};

// definition of issue updated event
const IssueUpdatedEvent = {
  event: models.IssueUpdatedEvent,
  schema: Joi.object().keys({
    action: Joi.string().valid('edited').required(),
    issue: Joi.object().required(),
    repository: Joi.object().required()
  }),
  parse: (data) => ({
    issue: parseIssue(data.issue),
    repository: parseRepository(data.repository)
  })
};

// definition of issue closed event
const IssueClosedEvent = {
  event: models.IssueClosedEvent,
  schema: Joi.object().keys({
    action: Joi.string().valid('closed').required(),
    issue: Joi.object().required(),
    repository: Joi.object().required()
  }),
  parse: (data) => ({
    issue: parseIssue(data.issue),
    repository: parseRepository(data.repository),
    assignee: {
      id: data.issue.assignee ? data.issue.assignee.id : null
    }
  })
};

// definition of issue comment updated event
const CommentCreatedEvent = {
  event: models.CommentCreatedEvent,
  schema: Joi.object().keys({
    action: Joi.string().valid('created').required(),
    issue: Joi.object().required(),
    repository: Joi.object().required(),
    comment: Joi.object().required()
  }),
  parse: parseComment
};

// definition of issue comment created event
const CommentUpdatedEvent = {
  event: models.CommentUpdatedEvent,
  schema: Joi.object().keys({
    action: Joi.string().valid('edited').required(),
    issue: Joi.object().required(),
    repository: Joi.object().required(),
    comment: Joi.object().required()
  }),
  parse: parseComment
};

// definition of issue user assigned event
const UserAssignedEvent = {
  event: models.UserAssignedEvent,
  schema: Joi.object().keys({
    action: Joi.string().valid('assigned').required(),
    issue: Joi.object().required(),
    assignee: Joi.object().required(),
    repository: Joi.object().required()
  }),
  parse: (data) => ({
    issue: parseIssue(data.issue),
    repository: parseRepository(data.repository),
    assignee: {
      id: data.assignee.id
    }
  })
};

// definition of issue user unassigned event
const UserUnassignedEvent = {
  event: models.UserUnassignedEvent,
  schema: Joi.object().keys({
    action: Joi.string().valid('unassigned').required(),
    issue: Joi.object().required(),
    assignee: Joi.object().required(),
    repository: Joi.object().required()
  }),
  parse: (data) => ({
    issue: parseIssue(data.issue),
    repository: parseRepository(data.repository)
  })
};

// definition of issue label updated event
const LabelUpdatedEvent = {
  event: models.LabelUpdatedEvent,
  schema: Joi.object().keys({
    action: Joi.string().valid('unlabeled', 'labeled').required(),
    issue: Joi.object().required(),
    label: Joi.object().required(),
    repository: Joi.object().required()
  }),
  parse: (data) => ({
    issue: parseIssue(data.issue),
    repository: parseRepository(data.repository),
    labels: _.map(data.issue.labels, 'name')
  })
};

// definition of pull request created event
const PullRequestCreatedEvent = {
  event: models.PullRequestCreatedEvent,
  schema: Joi.object().keys({
    action: Joi.string().valid('opened').required(),
    pull_request: Joi.object().required(),
    repository: Joi.object().required()
  }),
  parse: (data) => ({
    pull_request: parsePullRequest(data),
    repository: parseRepository(data.repository)
  })
};

// definition of pull request closed event
const PullRequestClosedEvent = {
  event: models.PullRequestClosedEvent,
  schema: Joi.object().keys({
    action: Joi.string().valid('closed').required(),
    pull_request: Joi.object().required(),
    repository: Joi.object().required()
  }),
  parse: (data) => ({
    pull_request: parsePullRequest(data),
    repository: parseRepository(data.repository)
  })
};

module.exports = new EventDetector('github', [
  IssueCreatedEvent,
  IssueUpdatedEvent,
  IssueClosedEvent,
  CommentCreatedEvent,
  CommentUpdatedEvent,
  UserAssignedEvent,
  UserUnassignedEvent,
  LabelUpdatedEvent,
  PullRequestCreatedEvent,
  PullRequestClosedEvent
]);
