import boto3
import os
import shutil
s3_client = boto3.client('s3', region_name='ca-central-1')

output_directory = './frames'

def framedownloader(message):


    if os.path.exists(output_directory):
        shutil.rmtree(output_directory)

    os.makedirs(output_directory)

    decoded = message['MessageAttributes']['s3_bucket_links']['BinaryValue'].decode('utf-8').strip("[]").replace('"', "")
    frame_names = list(decoded.split(","))
    frame_names = [x.strip(' ') for x in frame_names]
    os.chdir(output_directory)

    for framename in frame_names:
        
        print("FRAMENAME", framename)
        s3_client.download_file('quickscanimages', framename,framename)
    
    os.chdir('../')
    
    return True