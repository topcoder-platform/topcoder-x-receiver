#!/bin/bash
set -eo pipefail

# more bash-friendly output for jq
JQ="jq --raw-output --exit-status"

ENV=$1
TAG=$2
PROVIDER=$3
COUNTER_LIMIT=20
# Counter limit will be caluculaed based on sleep seconds

if [[ -z "$ENV" ]] ; then
        echo "Environment should be set on startup with one of the below values"
        echo "ENV must be one of - DEV, QA, PROD or LOCAL"
        exit
fi

AWS_REGION=$(eval "echo \$${ENV}_AWS_REGION")
AWS_ACCESS_KEY_ID=$(eval "echo \$${ENV}_AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY=$(eval "echo \$${ENV}_AWS_SECRET_ACCESS_KEY")
AWS_ACCOUNT_ID=$(eval "echo \$${ENV}_AWS_ACCOUNT_ID")
AWS_REPOSITORY=$(eval "echo \$${ENV}_AWS_REPOSITORY")
AWS_ECS_CLUSTER=$(eval "echo \$${ENV}_AWS_ECS_CLUSTER")
AWS_ECS_SERVICE=$(eval "echo \$${ENV}_AWS_ECS_SERVICE")
family=$(eval "echo \$${ENV}_AWS_ECS_TASK_FAMILY")
AWS_ECS_CONTAINER_NAME=$(eval "echo \$${ENV}_AWS_ECS_CONTAINER_NAME")
AWS_ECS_TASKDEF_FILE=$(eval "echo \$${ENV}_AWS_ECS_TASKDEF_FILE")

KAFKA_CLIENT_CERT=$(eval "echo \$${ENV}_KAFKA_CLIENT_CERT")
KAFKA_CLIENT_CERT_KEY=$(eval "echo \$${ENV}_KAFKA_CLIENT_CERT_KEY")
KAFKA_HOST=$(eval "echo \$${ENV}_KAFKA_HOST")
LOG_LEVEL=$(eval "echo \$${ENV}_LOG_LEVEL")
MONGODB_URI=$(eval "echo \$${ENV}_MONGODB_URI")
TOPIC=$(eval "echo \$${ENV}_TOPIC")
ZOO_KEEPER=$(eval "echo \$${ENV}_ZOO_KEEPER")

task_template=`cat container.template`
task_def=$(printf "$task_template" $family $AWS_ACCOUNT_ID $AWS_ECS_CONTAINER_NAME $AWS_ACCOUNT_ID $AWS_REGION $AWS_REPOSITORY $TAG "$DEBUG" "$KAFKA_CLIENT_CERT" "$KAFKA_CLIENT_CERT_KEY" "$KAFKA_HOST" "$LOG_LEVEL" "$MONGODB_URI" "$TOPIC" "$ZOO_KEEPER" "$NODE_ENV" "$NPM_CONFIG_PRODUCTION" "$PAPERTRAIL_API_TOKEN" ""$WEBSITE" 8000 8000 $AWS_ECS_CLUSTER $AWS_REGION $ENV)
