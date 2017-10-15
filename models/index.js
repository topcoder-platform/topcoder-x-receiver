/*
 * Copyright (c) 2017 TopCoder, Inc. All rights reserved.
 */
/**
 * This module contains all the events in this app.
 *
 * @author TCSCODER
 * @version 1.0
 */
'use strict';

const IssueCreatedEvent = require('./IssueCreatedEvent');
const IssueUpdatedEvent = require('./IssueUpdatedEvent');
const CommentCreatedEvent = require('./CommentCreatedEvent');
const UserAssignedEvent = require('./UserAssignedEvent');
const UserUnassignedEvent = require('./UserUnassignedEvent');
const LabelAssignedEvent = require('./LabelAssignedEvent');
const LabelUnassignedEvent = require('./LabelUnassignedEvent');
const PullRequestCreatedEvent = require('./PullRequestCreatedEvent');
const PullRequestClosedEvent = require('./PullRequestClosedEvent');

module.exports = {
  IssueCreatedEvent,
  IssueUpdatedEvent,
  CommentCreatedEvent,
  UserAssignedEvent,
  UserUnassignedEvent,
  LabelAssignedEvent,
  LabelUnassignedEvent,
  PullRequestCreatedEvent,
  PullRequestClosedEvent
};
