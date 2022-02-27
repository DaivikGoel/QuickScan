from videotoframe import videotoframe

import boto3

import urllib

sqs = boto3.client('sqs')

queue_url = 'https://sqs.ca-central-1.amazonaws.com/861570318875/3DObjectQueue.fifo'

# Send message to SQS queue
# Receive message from SQS queue
def queuepolling():
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
            VisibilityTimeout=10,
            WaitTimeSeconds=20
        )


        # print(response)
        i += 1
        #print( "Polled",i, response)

    message = response['Messages'][0]
    # print(message['MessageAttributes']['s3_bucket_links']['BinaryValue'])
    decoded = message['MessageAttributes']['s3_bucket_links']['BinaryValue'].decode('utf-8').strip("[]").replace('"', "")
    frame_names = list(decoded.split(","))

    for framename in frame_names:
        download_from_url(framename)

    # print(message)
    receipt_handle = message['ReceiptHandle']


    # Do all that needs to be done within 10 minutes
    # download frames using s3 link or google drive link 
    #Delete received message from queue
    # sqs.delete_message(
    #     QueueUrl=queue_url,
    #     ReceiptHandle=receipt_handle
    # )
    # print('Received and deleted message: %s' % message)

def download_from_url(framename):
    print(framename)
    # urllib.urlretrieve("http://www.example.com/songs/mp3.mp3", "mp3.mp3")

queuepolling()
