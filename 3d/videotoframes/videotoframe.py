import argparse
from imutils import paths
import cv2
from blurdetect import isblurry
import shutil
import os
shutil.rmtree('./frames') 
os.mkdir('./frames')
vidcap = cv2.VideoCapture('IMG_3171.MOV')
success,image = vidcap.read()
count = 0

while success:
  success,image = vidcap.read()
  pictureblurred, fm = isblurry(image)
  if pictureblurred == False:
    #cv2.putText(image, "{}: {:.2f}".format('Blur', fm), (10, 30),
		  #cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 3)
    cv2.imwrite( './frames/' + "frame%d.jpg" % count, image)     # save frame as JPEG file      
    print('Read a new frame: ', success)
    count += 1
  else:
    print ("Frame was deleted")

