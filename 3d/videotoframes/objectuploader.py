import boto3
import os, shutil

s3_client = boto3.client('s3', region_name='ca-central-1')

output_directory = './output_models'

def uploader(message):


    if os.path.exists(output_directory):
        shutil.rmtree(output_directory)

    os.makedirs(output_directory)
    uuid = message['MessageAttributes']['uuid']['StringValue']
    print("UUID", uuid)

    print("RUNNING COMMAND FOR PIPELINE")
    os.system('./HelloPhotogrammetry {} ./output_models/result.usdz -d medium '.format(output_directory))

 
    os.chdir(output_directory)
    
    print("WAITING FOR OBJECT")
    while os.path.exists('result.usdz') == False:
        continue
    print("OBJECT DONE")
    s3_client.upload_file('result.usdz','quickscanimages',uuid + '.usdz')

    os.chdir('../')
    
    return True