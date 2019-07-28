# Topcoder X Receiver Configuration
The following config parameters are supported, they are defined in `config/default.js` and can be configured in env variables:


| Name                                   | Description                                | Default                          |
| :------------------------------------- | :----------------------------------------: | :------------------------------: |
| PORT                                   | The port the application will listen on    |  3002                            |
| LOG_LEVEL                              | The log level                              |  info                            |
|TOPIC  | The Kafka topic where events are published.  This must be the same as the configured value for topcoder-x-processor| |
|KAFKA_OPTIONS | Kafka connection options| |
|KAFKA_URL | The Kafka host to connect to| localhost:9092 |
|KAFKA_CLIENT_CERT | The Kafka SSL certificate to use when connecting| Read from kafka_client.cer file, but this can be set as a string like it is on Heroku |
|KAFKA_CLIENT_CERT_KEY | The Kafka SSL certificate key to use when connecting| Read from kafka_client.key file, but this can be set as a string like it is on Heroku|
|AWS_ACCESS_KEY_ID | The Amazon certificate key to use when connecting. Use local dynamodb you can set fake value|FAKE_ACCESS_KEY_ID |
|AWS_SECRET_ACCESS_KEY | The Amazon certificate access key to use when connecting. Use local dynamodb you can set fake value|FAKE_SECRET_ACCESS_KEY |
|AWS_REGION | The Amazon certificate region to use when connecting. Use local dynamodb you can set fake value|FAKE_REGION |
|IS_LOCAL | Use Amazon DynamoDB Local or server |true|

KAFKA_OPTIONS should be object as described in https://github.com/oleksiyk/kafka#ssl
For using with SSL, the options should be as
```
 {
    connectionString: '<server>',
    ssl: {
      cert: '<certificate>',
      key:  '<key>'
    }
 }
```

## Endpoints

- POST /webhooks/github - The webhook handler for github
- POST /webhooks/gitlab - The webhook handler for gitlab

## Github Verification

#### Webhook configuration

Configure a Github project with a webhook with a format like this: https://<receiver URL>:<receiver port>/webhooks/github

#### Smoke test
- Create an issue in the repo, you can see the logs in `receiver`, the `issue.created` event is generated.

You can test other events, but just validating that an issue.created event is generated in Kafka is enough to smoke test the receiver is set up properly.

## Gitlab Verification

#### Webhook configuration

Configure a Gitlab project with a webhook with a format like this: https://<receiver URL>:<receiver port>/webhooks/gitlab

#### Smoke test

See above - the steps are the same for Github and Gitlab

## Debugging
You can re-run and debug the responses to webhook requests on Github and Gitlab, in the configuration for the webhook.  This can be useful if things aren't coming through properly in the receiver.
