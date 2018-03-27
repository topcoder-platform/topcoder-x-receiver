/*
 * Copyright (c) 2017 TopCoder, Inc. All rights reserved.
 */

/**
 * This module contains the EventDetector for gitlab.
 *
 * @author TCSCODER
 * @version 1.0
 */
'use strict';

const Joi = require('joi');
const _ = require('lodash');

const models = require('../models');
const EventDetector = require('./EventDetector');

const parseIssue = (data, issue) => ({
  number: issue.iid,
  body: issue.description,
  title: issue.title,
  labels: _.map(data.labels, 'title'),
  assignees: _.map(issue.assignee_ids, (assigneeId) => ({
    id: assigneeId
  })),
  owner: {
    id: issue.author_id
  }
});

const parseProject = (project) => ({
  id: project.id,
  name: project.name,
  full_name: project.path_with_namespace
});

const parseComment = (data) => ({
  issue: parseIssue(data, data.issue),
  repository: parseProject(data.project),
  comment: {
    id: data.object_attributes.id,
    body: data.object_attributes.note,
    user: {
      id: data.object_attributes.author_id
    }
  }
});

const parseIssueEventData = (data) => ({
  issue: parseIssue(data, data.object_attributes),
  repository: parseProject(data.project)
});

const parsePullRequest = (data) => ({
  number: data.object_attributes.iid,
  id: data.object_attributes.id,
  merged: data.object_attributes.state === 'merged',
  body: data.object_attributes.description,
  title: data.object_attributes.title,
  user: {
    id: data.object_attributes.author_id
  },
  assignees: data.object_attributes.assignee_id ? [{
    id: data.object_attributes.assignee_id
  }] : []
});


const IssueCreatedEvent = {
  event: models.IssueCreatedEvent,
  schema: Joi.object().keys({
    object_kind: Joi.string().valid('issue').required(),
    object_attributes: Joi.object().keys({
      state: Joi.string().valid('opened').required(),
      action: Joi.string().valid('open').required()
    }).required(),
    project: Joi.object().required()
  }),
  parse: parseIssueEventData
};

const IssueUpdatedEvent = {
  event: models.IssueUpdatedEvent,
  schema: Joi.object().keys({
    object_kind: Joi.string().valid('issue').required(),
    object_attributes: Joi.object().keys({
      state: Joi.string().valid('opened').required(),
      action: Joi.string().valid('update').required()
    }).required(),
    changes: Joi.object().keys({
      assignees: Joi.any().forbidden()
    }),
    project: Joi.object().required()
  }),
  parse: parseIssueEventData
};

const CommentCreatedEvent = {
  event: models.CommentCreatedEvent,
  schema: Joi.object().keys({
    object_kind: Joi.string().valid('note').required(),
    project: Joi.object().required(),
    object_attributes: Joi.object().keys({
      note: Joi.string().required(),
      noteable_type: Joi.string().valid('Issue').required()
    }).required()
  }),
  parse: parseComment
};

// begin the UserAssignedEvent
const UserAssignedEvent = {
  event: models.UserAssignedEvent,
  schema: Joi.object().keys({
    object_kind: Joi.string().valid('issue').required(),
    object_attributes: Joi.object().keys({
      state: Joi.string().valid('opened').required(),
      action: Joi.string().valid('update').required(),
      assignee_id: Joi.invalid(null).required()
    }).required(),
    changes: Joi.object().keys({
      assignees: Joi.object().keys({
        previous: Joi.array().required(),
        current: Joi.array().min(1).required()
      }).required()
    }),
    repository: Joi.object().required()
  }),
  parse: (data) => ({
    issue: parseIssue(data, data.object_attributes),
    repository: parseProject(data.project),
    assignee: {
      id: data.object_attributes.assignee_id
    }
  })
};

const UserUnassignedEvent = {
  event: models.UserUnassignedEvent,
  schema: Joi.object().keys({
    object_kind: Joi.string().valid('issue').required(),
    object_attributes: Joi.object().keys({
      state: Joi.string().valid('opened').required(),
      action: Joi.string().valid('update').required(),
      assignee_id: Joi.valid(null).required()
    }).required(),
    changes: Joi.object().keys({
      assignees: Joi.object().keys({
        previous: Joi.array().min(1).required(),
        current: Joi.array().length(0).required()
      }).required()
    }),
    repository: Joi.object().required()
  }),
  parse: (data) => ({
    issue: parseIssue(data, data.object_attributes),
    repository: parseProject(data.project)
  })
};

const LabelUpdatedEvent = {
  event: models.LabelUpdatedEvent,
  schema: Joi.object().keys({
    object_kind: Joi.string().valid('issue').required(),
    object_attributes: Joi.object().keys({
      state: Joi.string().valid('opened').required(),
      action: Joi.string().valid('update').required()
    }).required(),
    changes: Joi.object().keys({
      labels: Joi.object().required()
    }).required(),
    repository: Joi.object().required()
  }),
  parse: (data) => ({
    issue: parseIssue(data, data.object_attributes),
    repository: parseProject(data.project),
    labels: _.map(data.labels, 'title')
  })
};


const PullRequestCreatedEvent = {
  event: models.PullRequestCreatedEvent,
  schema: Joi.object().keys({
    object_kind: Joi.string().valid('merge_request').required(),
    object_attributes: Joi.object().keys({
      action: Joi.string().valid('open').required()
    }).required(),
    project: Joi.object().required()
  }),
  parse: (data) => ({
    pull_request: parsePullRequest(data),
    repository: parseProject(data.project)
  })
};

const PullRequestClosedEvent = {
  event: models.PullRequestClosedEvent,
  schema: Joi.object().keys({
    object_kind: Joi.string().valid('merge_request').required(),
    object_attributes: Joi.object().keys({
      action: Joi.string().valid('close', 'merge').required()
    }).required(),
    project: Joi.object().required()
  }),
  parse: (data) => ({
    pull_request: parsePullRequest(data),
    repository: parseProject(data.project)
  })
};

module.exports = new EventDetector('gitlab', [
  IssueCreatedEvent,
  IssueUpdatedEvent,
  CommentCreatedEvent,
  UserAssignedEvent,
  UserUnassignedEvent,
  LabelUpdatedEvent,
  PullRequestCreatedEvent,
  PullRequestClosedEvent
]);
