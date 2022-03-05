import io
import os
from google.cloud import vision
import random
def imagedetect():
    credential_path = "/solar-icon-319404-c5165d8e60d1.json"
    os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = os.getcwd() + credential_path
    
    # The name of the image file to annotate
    #os.chdir('./output_models')
    # Loads the image into memory
    files=os.listdir('./frames')
    d=random.choice(files)
    os.chdir('./frames')
    with io.open(d, 'rb') as image_file:
        content = image_file.read()

    image = vision.Image(content=content)
    client = vision.ImageAnnotatorClient()

    # Performs label detection on the image file
    response = client.label_detection(image=image)
    labels = response.label_annotations

    topical_labels = []

    print('Labels:')
    for label in labels:
        print(label.description + " score: " + str(label.score))

        if label.score > 0.90:
            topical_labels.append(label.description)

    print("tags to be sent: " + str(topical_labels))

    os.chdir('../')
    return topical_labels

# uncomment for testing:
# imagedetect()
