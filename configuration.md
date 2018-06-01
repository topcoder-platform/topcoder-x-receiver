# Topcoder x receiver configuration
The following config parameters are supported, they are defined in `config/default.js` and can be configured in env variables:


| Name                                   | Description                                | Default                          |
| :------------------------------------- | :----------------------------------------: | :------------------------------: |
| PORT                                   | The port the application will listen on    |  3002                            |
| LOG_LEVEL                              | The log level                              |  info                            |
| MONGODB_URI                            | The MongoDB URI.  This needs to be the same MongoDB used by topcoder-x-receiver, topcoder-x-processor, and topcoder-x-site                           | mongodb://127.0.0.1:27017/topcoderx |
|TOPIC  | The Kafka topic where events are published.  This must be the same as the configured value for topcoder-x-processor| |
|KAFKA_OPTIONS | Kafka connection options| |
|KAFKA_HOST | The Kafka host to connect to| localhost:9092 |
|KAFKA_CLIENT_CERT | The Kafka SSL certificate to use when connecting| Read from kafka_client.cer file, but this can be set as a string like it is on Heroku |
|KAFKA_CLIENT_CERT_KEY | The Kafka SSL certificate key to use when connecting| Read from kafka_client.key file, but this can be set as a string like it is on Heroku|

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

## Endpoints

- POST /webhooks/github - The webhook handler for github
- POST /webhooks/gitlab - The webhook handler for gitlab

## Github Verification

#### Webhook configuration

Configure a Github project with a webhook with a format like this: https://<receiver URL>:<receiver port>/webhooks/github

#### Smoke test
- Create an issue in the repo, you can see the logs in `receiver`, the `issue.created` event is generated.

You can test other events, but just validating that an issue.created event is generated in Kafka is enough to smoke test the receiver is set up properly.  

#### Debugging
You can re-run and debug the responses to webhook requests on Github, in the configuration for the webhook.  This can be useful if things aren't coming through properly in the receiver.

## Github Verification

#### Webhook configuration

Configure a Gitlab project with a webhook with a format like this: https://<receiver URL>:<receiver port>/webhooks/gitlab

#### Smoke test
- Create an issue in the repo, you can see the logs in `receiver`, the `issue.created` event is generated.

You can test other events, but just validating that an issue.created event is generated in Kafka is enough to smoke test the receiver is set up properly.  

#### Debugging
You can re-run and debug the responses to webhook requests on Gitlab, in the configuration for the webhook.  This can be useful if things aren't coming through properly in the receiver.
