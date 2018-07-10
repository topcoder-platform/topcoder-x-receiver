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

See "configuration.md"

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

## Setup for verification
Before verifying the tool, 3 service needs be configured and run them
- processor
- receiver
- Topcoder X

Go to Topcoder X UI login with above used topcoder username and
- go to settings and make sure git hosts are correctly setup, if not click setup and authorize to setup.

- Go to Topcoder X UI and go to project management and add a project from git account and click save, and edit the same project and click 'Add Webhooks' button, verify that webhooks are set up correctly on git host's project.

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
- close an issue in the repo, you can see the logs in `receiver` and `processor`, the `issue.closed` event is generated

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
- close an issue in the repo, you can see the logs in `receiver` and `processor`, the `issue.closed` event is generated
