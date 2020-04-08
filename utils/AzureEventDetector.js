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

/**
 * parse the issues from gitlab webhook
 * @param {object} data the gitlab webhook payload
 * @returns {object} the parsed issue detail
 */
const parseIssue = (data) => {
  const resource = data.resource.revision ? data.resource.revision : data.resource;
  return {
    number: resource.id,
    body: resource.fields['System.Description'],
    title: resource.fields['System.Title'],
    labels: resource.fields['System.Tags'] ? resource.fields['System.Tags'].split('; ') : [],
    assignees: resource.fields['System.AssignedTo'] ? [{id: resource.fields['System.AssignedTo'].id}] : [],
    owner: {
      id: resource.fields['System.CreatedBy'].id
    }
  };
};

/**
 * parse the project from gitlab webhook project  payload
 * @param {object} data the gitlab project payload
 * @returns {object} the parsed project detail
 */
const parseProject = (data) => {
  const resource = data.resource.revision ? data.resource.revision : data.resource;
  const repoName = resource.fields['System.TeamProject'];
  const repoUrl = data.resourceContainers.project.baseUrl + repoName;
  const results = repoUrl.split('/');
  const excludePart = 3;
  const repoOwner = _(results).slice(excludePart, results.length - 1).join('/');

  return {
    id: data.resourceContainers.project.id,
    name: resource.fields['System.TeamProject'],
    full_name: `${repoOwner}/${repoName}`
  };
};

/**
 * parse the comments from gitlab webhook payload
 * @param {object} data the gitlab webhook payload
 * @returns {object} the parsed comment detail
 */
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

/**
 * parse the issue event from gitlab webhook payload
 * @param {object} data the gitlab webhook payload
 * @returns {object} the parsed issue event detail
 */
const parseIssueEventData = (data) => ({
  issue: parseIssue(data),
  repository: parseProject(data)
});

/**
 * parse the pull request from gitlab webhook payload
 * @param {object} data the gitlab webhook payload
 * @returns {object} the parsed pull request detail
 */
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

// definition of issue created event
const IssueCreatedEvent = {
  event: models.IssueCreatedEvent,
  schema: Joi.object().keys({
    eventType: Joi.string().valid('workitem.created').required()
  }),
  parse: parseIssueEventData
};

// definition of issue updated event
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

// definition of issue closed event
const IssueClosedEvent = {
  event: models.IssueClosedEvent,
  schema: Joi.object().keys({
    eventType: Joi.string().valid('workitem.updated').required(),
    resource: Joi.object().keys({
      fields: Joi.object().keys({
        'System.State': Joi.object().keys({
          newValue: Joi.string().valid('Done').required()
        }).required()
      }).required()
    }).required()
  }),
  parse: (data) => ({
    issue: parseIssue(data),
    repository: parseProject(data),
    assignee: {
      id: data.resource.revision.fields['System.AssignedTo'] ?
        data.resource.revision.fields['System.AssignedTo'].id : null
    }
  })
};

// definition of issue comment created event
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

// definition of issue user assigned event
const UserAssignedEvent = {
  event: models.UserAssignedEvent,
  schema: Joi.object().keys({
    eventType: Joi.string().valid('workitem.updated').required(),
    resource: Joi.object().keys({
      fields: Joi.object().keys({
        'System.AssignedTo': Joi.object().keys({
          newValue: Joi.object().required()
        }).required()
      }).required()
    }).required()
  }),
  parse: (data) => ({
    issue: parseIssue(data),
    repository: parseProject(data),
    assignee: {
      id: data.resource.fields['System.AssignedTo'].newValue.id
    }
  })
};

// definition of issue user unassigned event
const UserUnassignedEvent = {
  event: models.UserUnassignedEvent,
  schema: Joi.object().keys({
    eventType: Joi.string().valid('workitem.updated').required(),
    resource: Joi.object().keys({
      fields: Joi.object().keys({
        'System.AssignedTo': Joi.object().keys({
          oldValue: Joi.object().required()
        }).required()
      }).required()
    }).required()
  }),
  parse: (data) => ({
    issue: parseIssue(data, data),
    repository: parseProject(data)
  })
};

// definition of issue label updated event
const LabelUpdatedEvent = {
  event: models.LabelUpdatedEvent,
  schema: Joi.object().keys({
    eventType: Joi.string().valid('workitem.updated').required(),
    resource: Joi.object().keys({
      fields: Joi.object().keys({
        'System.Tags': Joi.object().keys({
          newValue: Joi.string().required()
        }).required()
      }).required()
    }).required()
  }),
  parse: (data) => ({
    issue: parseIssue(data),
    repository: parseProject(data),
    labels: data.resource.fields['System.Tags'].newValue.split('; ')
  })
};

// definition of pull request created event
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

// definition of pull request closed event
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

module.exports = new EventDetector('azure', [
  IssueCreatedEvent,
  LabelUpdatedEvent,
  UserUnassignedEvent,
  UserAssignedEvent,
  IssueUpdatedEvent,
  IssueClosedEvent,
  CommentCreatedEvent,
  PullRequestCreatedEvent,
  PullRequestClosedEvent
]);
