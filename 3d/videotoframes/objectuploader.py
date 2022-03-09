import boto3
import os, shutil

s3_client = boto3.client('s3', region_name='ca-central-1')

output_directory = './output_models'
frames_directory = './frames'

def uploader(message):


    if os.path.exists(output_directory):
        shutil.rmtree(output_directory)

    os.makedirs(output_directory)
    uuid = message['MessageAttributes']['uuid']['StringValue']
    print("UUID", uuid)

    print("RUNNING COMMAND FOR PIPELINE")
    os.system('./HelloPhotogrammetry {} ./output_models/result.usdz -d full '.format(frames_directory))

 
    os.chdir(output_directory)

    Uploaded = False

    if os.path.exists('result.usdz') == False:
        Uploaded = False
        os.chdir('../')
        print("OBJECT CREATION FAILED")
    else: 
        print("OBJECT DONE")
        os.chdir('../')
        os.system('./ThumbnailGenerator')
        os.chdir(output_directory)
        s3_client.upload_file('result.usdz','quick-scan-3d-objects',uuid + '.usdz')
        s3_client.upload_file('thumbnail.png','quickscanthumbnails',uuid + '.png')
        Uploaded = True
        print("OBJECT uploaded")
        os.chdir('../')

    
    return Uploaded