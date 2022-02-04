from PIL import Image, ImageChops
from functools import reduce
import fcntl
import math, operator
import os


def acquireLock():
    ''' acquire exclusive lock file access, creates lock file if not exist '''
    locked_file_descriptor = open('lockfile.LOCK', 'w+')
    fcntl.lockf(locked_file_descriptor, fcntl.LOCK_EX)
    return locked_file_descriptor

def releaseLock(locked_file_descriptor):
    ''' release exclusive lock file access '''
    locked_file_descriptor.close()


# calculate the root-mean-square (RMS) value of the difference between the images. 
# If the images are exactly identical, this value is zero.
def rmsdiff(im1, im2):

    h = ImageChops.difference(im1, im2).histogram()

    # calculate rms
    return math.sqrt(reduce(operator.add,
        map(lambda h, i: h*(i**2), h, range(256))
    ) / (float(im1.size[0]) * im1.size[1]))

