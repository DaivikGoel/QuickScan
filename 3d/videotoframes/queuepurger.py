from videotoframe import videotoframe
from framedownloader import framedownloader
import boto3
import os
from objectuploader import uploader
import requests
import sys

from imagedetect import imagedetect

sqs = boto3.client('sqs')
s3_client = boto3.client('s3', region_name='ca-central-1')
output_directory = './frames'
queue_url = 'https://sqs.ca-central-1.amazonaws.com/861570318875/3DObject'
api_url = 'http://ec2-3-98-130-154.ca-central-1.compute.amazonaws.com:3000/finalobject'

# Send message to SQS queue
# Receive message from SQS queue
def queuepurger():
    response = {}
    i = 0
    while('Messages' not in response):

        response = sqs.receive_message(
            QueueUrl=queue_url,
            AttributeNames=[
                'SentTimestamp'
            ],
            MaxNumberOfMessages=1,
            MessageAttributeNames=[
                'collection_id',
                'number_of_images',
                's3_bucket_links',
                'uuid'
            ],
            VisibilityTimeout=1000,
            WaitTimeSeconds=10
        )


        i += 1
        print( "Polled",i, response)

    message = response['Messages'][0]
    # print(message)
    receipt_handle = message['ReceiptHandle']


    # Do all that needs to be done within 10 minutes
    # download frames using s3 link or google drive link 
    #Delete received message from queue
    sqs.delete_message(
        QueueUrl=queue_url,
        ReceiptHandle=receipt_handle
    )
    print('Received and deleted message: %s' % message)




if __name__ == '__main__': 

    while True:
        queuepurger()
