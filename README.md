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
| TOPIC                          | the kafka subscribe topic name             |  events_topic                    |
|KAFKA_OPTIONS                   | the connection option for kafka            |  see below about KAFKA options                   |
| GITHUB_SECRET_TOKEN            | the webhook security token for github      |                                  |
| GITLAB_SECRET_TOKEN            | the webhook security token for gitlab      |                                  |
| WATCH_REPOS                    | the repos we want to watch                 |                                  |

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

To change the WATCH_REPOS, you'd better create a `config/local.js` file to override the WATCH_REPOS, see `config/sample-local.js` for example.

`config/local.js` will not tracked by git.

Normally you just need config the GITHUB_SECRET_TOKEN and GITLAB_SECRET_TOKEN (optional in this challenge):

```shell
export GITHUB_SECRET_TOKEN=...
export GITLAB_SECRET_TOKEN=...
```

Or on windows:

```shell
set GITHUB_SECRET_TOKEN=...
set GITLAB_SECRET_TOKEN=...
```


## GitHub Webhook Setup

- login into github.com
- go to the repository you want to watch
- click: Settings -> Options(in the left panel) -> Webhooks
- click: 'Add Webhook' button
- fill the form:
    - Payload URL: `https://<YOUR_HOST>/webhooks/github`,
    for example: `https://4bb6c860.ngrok.io/webhooks/github`
    - Content Type: application/json
    - Secret: type your secret and remember it to set into GITHUB_SECRET_TOKEN
    - Check: Send me everything
    - Check: Active
- click: 'Add Webhook' button

## GitLab Webhook Setup (optional for this challenge)

- login into gitlab.com
- go to the repository you want to watch
- click: Settings -> Integrations
- fill the form: 
    - URL: `https://<YOUR_HOST>/webhooks/gitlab`,
    for example: `https://4bb6c860.ngrok.io/webhooks/gitlab`
    - Secret Token: type your secret and remember it to set into GITLAB_SECRET_TOKEN
    - Trigger: Check all the events
    - Check: Enable SSL Verifications
- click: 'Add Webhook' button


## Local Setup

```shell
npm start
```

Server should be started at port 3000.

use `ngrok` to make your local deploy accessible by internet:
```shell
ngrok http 3000
```

## GitHub Verification

- properly config and run the `receiver` app.
- properly config and run the `processor` app.
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

- properly config and run the `receiver` app.
- properly config and run the `processor` app.
- create an issue in the repo, you can see the logs in `receiver` and `processor`, the `issue.created` event is generated.
- update an issue in the repo, you can see the logs in `receiver` and `processor`, the `issue.updated` event is generated.
- create a comment on an issue, you can see the logs in `receiver` and `processor`, the `comment.created` event is generated.
- assigned a user to an issue, you can see the logs in `receiver` and `processor`, the `issue.assigned` event is generated.
- un-assigned a user to an issue, you can see the logs in `receiver` and `processor`, the `issue.unassigned` event is generated.
- add/remove a label to an issue, you can see the logs in `receiver` and `processor`, the `issue.labelUpdated` event is generated.
- create a pull request, you can see the logs in `receiver` and `processor`, the `pull_request.created` event is generated.
- close a pull request without merge, you can see the logs in `receiver` and `processor`, the `pull_request.closed` event is generated and the `merged` property is `false`.
- merge a pull request, you can see the logs in `receiver` and `processor`, the `pull_request.closed` event is generated and the `merged` property is `true`.