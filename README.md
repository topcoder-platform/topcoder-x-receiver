## Requirements

- Nodejs 8 is required
- [Apache Kafka](https://kafka.apache.org/)
 - [Local installation guide](https://devops.profitbricks.com/tutorials/install-and-configure-apache-kafka-on-ubuntu-1604-1/)
## Install dependencies

```shell
npm install
```

## Source code lint

eslint is used to lint the javascript source code:

```shell
npm run lint
```

## Endpoints

- POST /webhooks/github - The webhook handler for github
- POST /webhooks/gitlab - The webhook handler for gitlab


## Configuration

The following config parameters are supported, they are defined in `config/default.js` and can be configured in system environment:


| Name                           | Description                                | Default                          |
| :----------------------------- | :----------------------------------------: | :------------------------------: |
| PORT                           | the port the application will listen on    |  3000                            |
| LOG_LEVEL                      | the log level                              |  info                            |
| TOPIC                          | the kafka subscribe topic name             |  tc-x-events                    |
| WEBHOOK_SECRET_TOKEN            | the webhook security token for githost, it must be same as `WEBHOOK_SECRET_TOKEN` configured for Topcoder-X-backend| `ka75hsrq65cFEr61Hd4x`|
|KAFKA_OPTIONS                   | the connection option for kafka            |  see below about KAFKA options                   |
| MONGODB_URL  | the MongoDB URL which must be same as Ragnar tool | mongodb://127.0.0.1:27017/ragnar|

KAFKA_OPTIONS should be object as described in https://github.com/SOHU-Co/kafka-node#kafkaclient
For using with SSL, the options should be as
```
 {
    kafkaHost: '<server>',
    sslOptions: {
      cert: '<certificate>', 
      key:  '<key>'
    }
 }
```

`config/local.js` will not tracked by git.

## Local Setup

```shell
npm start
```

Server should be started at port 3002.

use `ngrok` to make your local deploy accessible by internet:
```shell
ngrok http 3002
```

Copy the forwarding URL to set in `HOOK_BASE_URL` of topcoder-x-ui in config.json

## Setup for verification
Before verifying the tool, 4 service needs be configured and run them
- processor
- receiver
- Ragnar Tool
- Topcoder X (both backend and UI)

First login in Ragnar tool with admin and Add owner for which requires topcoder handle, git host's username and type of git host.

Go to Topcoder X UI login with above used topcoder username and
- go to settings and make sure git hosts are correctly setup, if not click setup and authorize to setup.

- Go to Topcoder X UI and go to project management and add a project from git account and click save, and edit the same project and click 'Add Webhooks' button (you need to add personnel access token), verify that webhooks are set up correctly on git host's project.

Now, receiver service can receive the webhooks from git host's project. Now you can verify this service by following the verfication steps below

## GitHub Verification

- create an issue in the repo, you can see the logs in `receiver` and `processor`, the `issue.created` event is generated.
- update an issue in the repo, you can see the logs in `receiver` and `processor`, the `issue.updated` event is generated.
- create a comment on an issue, you can see the logs in `receiver` and `processor`, the `comment.created` event is generated.
- update a comment on an issue, you can see the logs in `receiver` and `processor`, the `comment.updated` event is generated.
- assigned a user to an issue, you can see the logs in `receiver` and `processor`, the `issue.assigned` event is generated.
- un-assigned a user to an issue, you can see the logs in `receiver` and `processor`, the `issue.unassigned` event is generated.
- add/remove a label to an issue, you can see the logs in `receiver` and `processor`, the `issue.labelUpdated` event is generated.
- create a pull request, you can see the logs in `receiver` and `processor`, the `pull_request.created` event is generated.
- close a pull request without merge, you can see the logs in `receiver` and `processor`, the `pull_request.closed` event is generated and the `merged` property is `false`.
- merge a pull request, you can see the logs in `receiver` and `processor`, the `pull_request.closed` event is generated and the `merged` property is `true`.

## Gitlab Verification

- create an issue in the repo, you can see the logs in `receiver` and `processor`, the `issue.created` event is generated.
- update an issue in the repo, you can see the logs in `receiver` and `processor`, the `issue.updated` event is generated.
- create a comment on an issue, you can see the logs in `receiver` and `processor`, the `comment.created` event is generated.
- assigned a user to an issue, you can see the logs in `receiver` and `processor`, the `issue.assigned` event is generated.
- un-assigned a user to an issue, you can see the logs in `receiver` and `processor`, the `issue.unassigned` event is generated.
- add/remove a label to an issue, you can see the logs in `receiver` and `processor`, the `issue.labelUpdated` event is generated.
- create a pull request, you can see the logs in `receiver` and `processor`, the `pull_request.created` event is generated.
- close a pull request without merge, you can see the logs in `receiver` and `processor`, the `pull_request.closed` event is generated and the `merged` property is `false`.
- merge a pull request, you can see the logs in `receiver` and `processor`, the `pull_request.closed` event is generated and the `merged` property is `true`.