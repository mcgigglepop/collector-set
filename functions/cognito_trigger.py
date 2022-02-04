import boto3
import os
import time

def lambda_handler(event, context):
    # print event
    print(event)

    # get cognito data from event
    cognito_username = event['request']['userAttributes']['sub']
    email = event['request']['userAttributes']['email']
    account_type = 'free'

    # timestamp
    timestamp = str(time.time())

    # update the dynamo table
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(os.environ['DYNAMODB_TABLE'])
    
    result = table.update_item(
        Key={
            'cognito_username': cognito_username
        },
        ExpressionAttributeNames={
        '#todo_email': 'email',
        '#todo_account_type': 'account_type',
        '#todo_updated': 'updated_at'
        },
        ExpressionAttributeValues={
        ':email': email,
        ':account_type': account_type
        ':updated': timestamp,
        },
        UpdateExpression='SET #todo_email = :email, #todo_account_type = :account_type, #todo_updated = :updated',
        ReturnValues='ALL_NEW',
    )

    return event 