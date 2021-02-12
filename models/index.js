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

const config = require('config');
const dynamoose = require('dynamoose');


const awsConfigs = config.DYNAMODB.IS_LOCAL_DB ? {
  accessKeyId: config.DYNAMODB.AWS_ACCESS_KEY_ID,
  secretAccessKey: config.DYNAMODB.AWS_SECRET_ACCESS_KEY,
  region: config.DYNAMODB.AWS_REGION
} : {
  region: config.DYNAMODB.AWS_REGION
};

dynamoose.AWS.config.update(awsConfigs);

if (config.DYNAMODB.IS_LOCAL_DB) {
  dynamoose.local(config.DYNAMODB.DYNAMODB_URL);
}

// dynamoose.AWS.config.update({
//   // accessKeyId: config.DYNAMODB.AWS_ACCESS_KEY_ID,
//   // secretAccessKey: config.DYNAMODB.AWS_SECRET_ACCESS_KEY,
//   region: config.DYNAMODB.AWS_REGION
// });

// if (config.DYNAMODB.IS_LOCAL === 'true') {
//   dynamoose.local();
// }

dynamoose.setDefaults({
  create: false,
  update: false
});

if (process.env.CREATE_DB) {
  dynamoose.setDefaults({
    create: true,
    update: true
  });
}

const IssueCreatedEvent = require('./IssueCreatedEvent');
const IssueUpdatedEvent = require('./IssueUpdatedEvent');
const IssueClosedEvent = require('./IssueClosedEvent');
const CommentCreatedEvent = require('./CommentCreatedEvent');
const CommentUpdatedEvent = require('./CommentUpdatedEvent');
const UserAssignedEvent = require('./UserAssignedEvent');
const UserUnassignedEvent = require('./UserUnassignedEvent');
const PullRequestCreatedEvent = require('./PullRequestCreatedEvent');
const PullRequestClosedEvent = require('./PullRequestClosedEvent');
const LabelUpdatedEvent = require('./LabelUpdatedEvent');
const Project = require('./Project');

module.exports = {
  IssueCreatedEvent,
  IssueUpdatedEvent,
  CommentCreatedEvent,
  CommentUpdatedEvent,
  UserAssignedEvent,
  UserUnassignedEvent,
  PullRequestCreatedEvent,
  PullRequestClosedEvent,
  LabelUpdatedEvent,
  Project: dynamoose.model('Topcoder_X.Project', Project),
  IssueClosedEvent
};
