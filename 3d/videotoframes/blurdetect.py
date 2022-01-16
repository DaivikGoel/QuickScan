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
    threshold = 50
    # loop over the input images
    #for imagePath in paths.list_images(imagelocation):
        # load the image, convert it to grayscale, and compute the
        # focus measure of the image using the Variance of Laplacian
        # method
    # image = cv2.imread(image)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    fm = variance_of_laplacian(gray)
    # if the focus measure is less than the supplied threshold,
    # then the image should be considered "blurry"
    #print("FM:", fm)
    if fm < threshold:
        return True
    else:
        return False
