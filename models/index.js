/*
 * Copyright (c) 2017 TopCoder, Inc. All rights reserved.
 */
/**
 * This module contains all the events in this app.
 * Changes in 1.1:
 * - changes related to https://www.topcoder.com/challenges/30060466
 * @author TCSCODER
 * @version 1.1
 */
'use strict';

const IssueCreatedEvent = require('./IssueCreatedEvent');
const IssueUpdatedEvent = require('./IssueUpdatedEvent');
const CommentCreatedEvent = require('./CommentCreatedEvent');
const CommentUpdatedEvent = require('./CommentUpdatedEvent');
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
  CommentUpdatedEvent,
  UserAssignedEvent,
  UserUnassignedEvent,
  LabelAssignedEvent,
  LabelUnassignedEvent,
  PullRequestCreatedEvent,
  PullRequestClosedEvent
};
