import os
import re
from Sift.match_two_images import siftCompare
from similaritydetect import acquireLock, releaseLock, rmsdiff
from PIL import Image

class Threasholds():
    # higher for RMS = delete more frames
    rms_diff_limit = 30.0

    # lower for SIFT = delete more frames
    sift_error_threashold = 20.0 

frames_directory = './frames'; image_name = '/frame'; image_fmt = '.JPG'

def getStartingIdx(lastFrameNum):
    # find reference image in directory (frame with the lowest index)
    starting_idx = 0
    while starting_idx < lastFrameNum:
        ref_image_path = frames_directory + image_name + str(starting_idx) + image_fmt
        if (os.path.isfile(ref_image_path) and ref_image_path.endswith(image_fmt)):
            break
        starting_idx +=1 

    return starting_idx

# get the last frame number from name
def getMaxFrameNum(_frames_directory = frames_directory):
    filenames = os.listdir(path = _frames_directory)
    num = 0
    max = 0
    for filename in filenames:
        num = (int(re.findall('\d+', filename )[0]))
        if num > max:
            max = num

    return max

def removeSimilarFramesRMS():
    # lock directory
    lock_fd = acquireLock()

    deleted = 0
    directory = os.fsencode(frames_directory)
    images_in_dir_cnt = len(os.listdir(directory))

    lastFrameNum = getMaxFrameNum(frames_directory)

    # find reference image in directory (frame with the lowest index)
    starting_idx = getStartingIdx(lastFrameNum)
    reference_image = Image.open(frames_directory + image_name + str(starting_idx) + image_fmt)

    for i in range(starting_idx+1, lastFrameNum):
        comparing_image_path = frames_directory + image_name + str(i) + image_fmt
        if (not os.path.isfile(comparing_image_path)):
            continue

        comparing_image = Image.open(comparing_image_path)
        diff = rmsdiff(reference_image, comparing_image)

        if (diff > Threasholds.rms_diff_limit):
            # update the reference being compared to
            reference_image = comparing_image
        else :
            # if too similar, delete the img
            print("deleteing" + frames_directory + image_name + str(i) + image_fmt)
            deleted += 1
            os.remove(comparing_image_path)


    print("Number of frames deleted using RMS: " + str(deleted))
    # release write access on directory
    releaseLock(lock_fd)
    return



def removeSimilarFramesSIFT():
    lock_fd = acquireLock()
    directory = os.fsencode(frames_directory)
    images_in_dir_cnt = len(os.listdir(directory))

    lastFrameNum = getMaxFrameNum(frames_directory)
    starting_idx = getStartingIdx(lastFrameNum)
    
    reference_image_path = str(frames_directory + image_name + str(starting_idx) + image_fmt)
    deleted = 0


    for i in range(starting_idx+1, lastFrameNum):
        comparing_image_path = frames_directory + image_name + str(i) + image_fmt
        if (not os.path.isfile(comparing_image_path)):
            continue

        errorScore, keyPointsPercentDiff, keyPointsA, keyPointsB = siftCompare(reference_image_path, comparing_image_path)

        if (errorScore > Threasholds.sift_error_threashold):
            #delete Image B (comparing Image)
            print("deleteing: " + comparing_image_path)
            deleted += 1
            os.remove(comparing_image_path)
            
        else:
            # make B reference image
            print('replaced reference image with: {}'.format(comparing_image_path))
            reference_image_path = comparing_image_path

    print("Number of frames deleted using SIFT: " + str(deleted))
    # release write access on directory
    releaseLock(lock_fd)
