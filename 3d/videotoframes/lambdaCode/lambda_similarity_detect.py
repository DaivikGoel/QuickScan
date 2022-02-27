from PIL import ImageChops
from functools import reduce
import math, operator


# calculate the root-mean-square (RMS) value of the difference between the images. 
# If the images are exactly identical, this value is zero.
def rmsdiff(im1, im2):

    h = ImageChops.difference(im1, im2).histogram()

    # calculate rms
    return math.sqrt(reduce(operator.add,
        map(lambda h, i: h*(i**2), h, range(256))
    ) / (float(im1.size[0]) * im1.size[1]))
