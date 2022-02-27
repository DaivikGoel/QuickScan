import argparse
from imutils import paths
import cv2

def variance_of_laplacian(image):
	# compute the Laplacian of the image and then return the focus
	# measure, which is simply the variance of the Laplacian
	return cv2.Laplacian(image, cv2.CV_64F).var()

def isblurry(image):
    # construct the argument parse and parse the arguments
    #imagelocation = "/Users/daivikgoel/Desktop/frames/"
    threshold = 40

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    fm = variance_of_laplacian(gray)
    # if the focus measure is less than the supplied threshold,
    # then the image should be considered "blurry"

    if fm < threshold:
        return True, fm
    else:
        return False, fm