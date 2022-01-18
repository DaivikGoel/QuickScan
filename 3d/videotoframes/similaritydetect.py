from PIL import Image, ImageChops
from functools import reduce
import fcntl
import math, operator
import os


rms_diff_limit = 27.0
frames_directory = './frames'; image_name = '/frame'; image_fmt = '.JPG'

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


# lock directory
lock_fd = acquireLock()

deleted = 0
directory = os.fsencode(frames_directory)
images_in_dir_cnt = len(os.listdir(directory))

# find reference image in directory (frame with the lowest index)
starting_idx = 0
while starting_idx < images_in_dir_cnt:
    ref_image_path = frames_directory + image_name + str(starting_idx) + image_fmt
    if (os.path.isfile(ref_image_path)):
        break
    starting_idx +=1 

reference_image = Image.open(frames_directory + image_name + str(starting_idx) + image_fmt)
print("Starting idx: " + str(starting_idx))


for i in range(starting_idx+1, images_in_dir_cnt):
    comparing_image_path = frames_directory + image_name + str(i) + image_fmt
    if (not os.path.isfile(comparing_image_path)):
        continue

    comparing_image = Image.open(comparing_image_path)
    diff = rmsdiff(reference_image, comparing_image)

    if (diff > rms_diff_limit):
        # update the reference being compared to
        reference_image = comparing_image
    else :
        # if too similar, delete the img
        print("deleteing" + frames_directory + image_name + str(i) + image_fmt)
        deleted += 1
        os.remove(comparing_image_path)


print("Number of frames deleted: " + str(deleted))
# release write access on directory
releaseLock(lock_fd)
