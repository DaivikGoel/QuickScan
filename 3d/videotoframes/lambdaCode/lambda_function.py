import cv2
from blurdetect import isblurry
from reduceframes import removeSimilarFramesRMS, removeSimilarFramesSIFT
import shutil
import boto3
from PIL import Image
import io
import os
import tempfile
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

sqs = boto3.client('sqs')
queue_url = 'https://sqs.ca-central-1.amazonaws.com/861570318875/3DObjectQueue.fifo'


def push_to_sqs(event, number_of_images, linkarray):
    # Send message to SQS queue
    response = sqs.send_message(
    QueueUrl=queue_url,
    DelaySeconds=0,
    MessageGroupId="0",
    MessageAttributes={
        'uuid': {
            'DataType': 'String',
            'StringValue': event["body"]["uuid"]
        },
        'collection_id': {
            'DataType': 'String',
            'StringValue': event["body"]["collection_id"]
        },
        'number_of_images': {
            'DataType': 'Number',
            'StringValue': str(number_of_images)
        },
        # TODO: send array of links, of the images that got uploaded 
        's3_bucket_links' : {
            
            'DataType': 'Binary.array',
            'Value': linkarray
            
        }
    },
    MessageBody=(
        'EMPTY'
    )
)

def upload_frames_to_s3(uuid, output_directory):
    linkarray = []
    
    for image_path in os.listdir(output_directory):
        logger.info(f'Got Image Path: {image_path}')
        img = Image.open(os.path.join(output_directory, image_path))
        frame_name = uuid + image_path
        logger.info(f'Frame Name: {frame_name}')
        uploaded = s3_client.upload_file(img,'quickscanimages',frame_name, ExtraArgs={'ACL': 'public-read'})
        
        if uploaded == true:
            logger.info(f'Uploaded')
            linkarray.push(frame_name)
            logger.info(f'linkarray: {linkarray}')
    
    return linkarray
        


def lambda_handler(event, context):
    logger.info('lambda fn invoked')
    output_directory = '/tmp'
    
    # comment this out for not testing 
    # push_to_sqs(event, 30)

    #logger.info('This is a short test run to enqueue request to SQS')
    # return {
    #     'message': "this is a short test run: " + event["body"]["uuid"]
    # }


    for filename in os.listdir(output_directory):
        file_path = os.path.join(output_directory, filename)
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
        except Exception as e:
            print('Failed to delete %s. Reason: %s' % (file_path, e))
            logger.error('Failed to delete %s. Reason: %s' % (file_path, e))

        
    s3_client = boto3.client('s3', region_name='ca-central-1')
    url = s3_client.generate_presigned_url( ClientMethod='get_object', Params={ 'Bucket': "quickscans3", 'Key': "meat.MOV" } )
    vidcap = cv2.VideoCapture(url)
    success,image = vidcap.read()
    count = 0
    
    print(vidcap)
    print(success)
    
    while success:
        success,image = vidcap.read()
    
        if image is None:
            continue
    
        pictureblurred, fm = isblurry(image)
        if not pictureblurred:
            cv2.imwrite(output_directory + '/'+ "frame%d.jpg" % count, image) 
            # img = Image.fromarray(image)
            # imgByteArr = io.BytesIO()
            # img.save(imgByteArr, format='JPEG')
            # imgByteArr = imgByteArr.getvalue()
            # frame_name = "frame" + str(count) + ".jpg"
            # with tempfile.NamedTemporaryFile(mode="wb", delete="True") as jpg:
            #     jpg.write(imgByteArr)
            #     s3_client.upload_file(jpg.name,'quickscanimages',frame_name)
            count += 1

        else:
            print ("blurry frame was deleted")
            
    # print("NUMBER OF FRAMES in dir /tmp after blur detection ", len(os.listdir(output_directory)))
    logger.info(f'NUMBER OF FRAMES in dir /tmp after blur detection {len(os.listdir(output_directory))}')
    print("count of non blurry images ", count)
    logger.info(f'count of non blurry images: {count}')
    
    removeSimilarFramesRMS()
    removeSimilarFramesSIFT()
    
    logger.info(f'number OF frames left after RMS and SIFT {len(os.listdir(output_directory))}')
    logger.info('completed video to frame processing, generating model now...')

    # TODO: enqueue the event and contexts
    linkarray = upload_frames_to_s3(event["body"]["uuid"], output_directory)
    
    push_to_sqs(event, len(linkarray), linkarray)
    # os.system('./HelloPhotogrammetry {} ./output_models/result.usdz -d medium '.format(output_directory))
    
    print('Completed Model')
    
    return { 
     'message' : success
    }
    