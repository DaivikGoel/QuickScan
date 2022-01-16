import argparse
from imutils import paths
import cv2
from blurdetect import isblurry
import os
vidcap = cv2.VideoCapture('IMG_3139.MOV')
success,image = vidcap.read()
count = 0
retval = os.getcwd()
print("Current working directory %s" % retval)
while success:
  success,image = vidcap.read()
  pictureblurred = isblurry(image)
  if pictureblurred == False:
    cv2.imwrite( "./frames/" + "frame%d.jpg" % count, image)     # save frame as JPEG file      
    print('Read a new frame: ', success)
    count += 1
  else:
    print ("Frame was deleted")
