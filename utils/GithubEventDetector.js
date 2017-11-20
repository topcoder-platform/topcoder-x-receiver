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

const parseIssue = (issue) => ({
  number: issue.number,
  body: issue.body,
  title: issue.title,
  labels: _.map(issue.labels, 'name'),
  assignees: _.map(issue.assignees, (assignee) => ({
    id: assignee.id,
    name: assignee.login
  })),
  owner: {
    id: issue.user.id,
    name: issue.user.login
  }
});

const parseRepository = (repository) => ({
  id: repository.id,
  name: repository.name,
  full_name: repository.full_name
});

const parsePullRequest = (data) => ({
  number: data.number,
  id: data.pull_request.id,
  merged: data.pull_request.merged,
  body: data.pull_request.body,
  title: data.pull_request.title,
  user: {
    id: data.pull_request.user.id,
    name: data.pull_request.user.login
  },
  assignees: _.map(data.pull_request.assignees, (a) => ({
    id: a.id,
    name: a.login
  }))
});

// begin the IssueCreatedEvent
const IssueCreatedEvent = {
  event: models.IssueCreatedEvent
};

IssueCreatedEvent.schema = Joi.object().keys({
  action: Joi.string().valid('opened').required(),
  issue: Joi.object().required(),
  repository: Joi.object().required()
});

IssueCreatedEvent.parse = (data) => ({
  issue: parseIssue(data.issue),
  repository: parseRepository(data.repository)
});

// end the IssueCreatedEvent

// begin the IssueUpdatedEvent
const IssueUpdatedEvent = {
  event: models.IssueUpdatedEvent
};

IssueUpdatedEvent.schema = Joi.object().keys({
  action: Joi.string().valid('edited').required(),
  issue: Joi.object().required(),
  repository: Joi.object().required()
});

IssueUpdatedEvent.parse = (data) => ({
  issue: parseIssue(data.issue),
  repository: parseRepository(data.repository)
});

// end the IssueUpdatedEvent

const parseComment = (data) => ({
  issue: parseIssue(data.issue),
  repository: parseRepository(data.repository),
  comment: {
    id: data.comment.id,
    body: data.comment.body,
    user: {
      id: data.comment.user.id,
      name: data.comment.user.login
    }
  }
});
// begin the CommentCreatedEvent
const CommentCreatedEvent = {
  event: models.CommentCreatedEvent
};

CommentCreatedEvent.schema = Joi.object().keys({
  action: Joi.string().valid('created').required(),
  issue: Joi.object().required(),
  repository: Joi.object().required(),
  comment: Joi.object().required()
});

CommentCreatedEvent.parse = parseComment;

// end the CommentCreatedEvent

// begin the CommentUpdatedEvent
const CommentUpdatedEvent = {
  event: models.CommentUpdatedEvent
};

CommentUpdatedEvent.schema = Joi.object().keys({
  action: Joi.string().valid('edited').required(),
  issue: Joi.object().required(),
  repository: Joi.object().required(),
  comment: Joi.object().required()
});

CommentUpdatedEvent.parse = parseComment;
// end the CommentUpdatedEvent

// begin the UserAssignedEvent
const UserAssignedEvent = {
  event: models.UserAssignedEvent
};

UserAssignedEvent.schema = Joi.object().keys({
  action: Joi.string().valid('assigned').required(),
  issue: Joi.object().required(),
  assignee: Joi.object().required(),
  repository: Joi.object().required()
});

UserAssignedEvent.parse = (data) => ({
  issue: parseIssue(data.issue),
  repository: parseRepository(data.repository),
  assignee: {
    id: data.assignee.id,
    name: data.assignee.login
  }
});

// end the UserAssignedEvent

// begin the UserUnassignedEvent
const UserUnassignedEvent = {
  event: models.UserUnassignedEvent
};

UserUnassignedEvent.schema = Joi.object().keys({
  action: Joi.string().valid('unassigned').required(),
  issue: Joi.object().required(),
  assignee: Joi.object().required(),
  repository: Joi.object().required()
});

UserUnassignedEvent.parse = (data) => ({
  issue: parseIssue(data.issue),
  repository: parseRepository(data.repository),
  assignee: {
    id: data.assignee.id,
    name: data.assignee.login
  }
});

// end the UserUnassignedEvent

// begin the LabelAssignedEvent
const LabelAssignedEvent = {
  event: models.LabelAssignedEvent
};

LabelAssignedEvent.schema = Joi.object().keys({
  action: Joi.string().valid('labeled').required(),
  issue: Joi.object().required(),
  label: Joi.object().required(),
  repository: Joi.object().required()
});

LabelAssignedEvent.parse = (data) => ({
  issue: parseIssue(data.issue),
  repository: parseRepository(data.repository),
  label: data.label.name
});
// end the LabelAssignedEvent

// begin the LabelUnassignedEvent
const LabelUnassignedEvent = {
  event: models.LabelUnassignedEvent
};

LabelUnassignedEvent.schema = Joi.object().keys({
  action: Joi.string().valid('unlabeled').required(),
  issue: Joi.object().required(),
  label: Joi.object().required(),
  repository: Joi.object().required()
});

LabelUnassignedEvent.parse = (data) => ({
  issue: parseIssue(data.issue),
  repository: parseRepository(data.repository),
  label: data.label.name
});

// end the LabelUnassignedEvent

// begin the PullRequestCreatedEvent
const PullRequestCreatedEvent = {
  event: models.PullRequestCreatedEvent
};

PullRequestCreatedEvent.schema = Joi.object().keys({
  action: Joi.string().valid('opened').required(),
  pull_request: Joi.object().required(),
  repository: Joi.object().required()
});

PullRequestCreatedEvent.parse = (data) => ({
  pull_request: parsePullRequest(data),
  repository: parseRepository(data.repository)
});
// end the PullRequestCreatedEvent

// begin the PullRequestClosedEvent
const PullRequestClosedEvent = {
  event: models.PullRequestClosedEvent
};

PullRequestClosedEvent.schema = Joi.object().keys({
  action: Joi.string().valid('closed').required(),
  pull_request: Joi.object().required(),
  repository: Joi.object().required()
});

PullRequestClosedEvent.parse = (data) => ({
  pull_request: parsePullRequest(data),
  repository: parseRepository(data.repository)
});
// end the PullRequestClosedEvent

module.exports = new EventDetector('github', [
  IssueCreatedEvent,
  IssueUpdatedEvent,
  CommentCreatedEvent,
  CommentUpdatedEvent,
  UserAssignedEvent,
  UserUnassignedEvent,
  LabelAssignedEvent,
  LabelUnassignedEvent,
  PullRequestCreatedEvent,
  PullRequestClosedEvent
]);
