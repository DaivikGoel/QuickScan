import os
import cv2 

def calculateErrorScore(matches, keypoint1, keypoint2):
    return 100 * abs((matches/keypoint1) - (matches/keypoint2))


def siftCompare(imgPath1, imgPath2):
    img1 = cv2.imread(imgPath1)
    img2 = cv2.imread(imgPath2)  

    if (not os.path.isfile(imgPath1) or not os.path.isfile(imgPath2)):
        return

    img1 = cv2.cvtColor(img1, cv2.COLOR_BGR2GRAY)
    img2 = cv2.cvtColor(img2, cv2.COLOR_BGR2GRAY)

    #sift, compute keypoints, descriptors
    sift = cv2.SIFT_create()
    keypoints_1, descriptors_1 = sift.detectAndCompute(img1,None)
    keypoints_2, descriptors_2 = sift.detectAndCompute(img2,None)

    found_keypoints_1 = len(keypoints_1); found_keypoints_2 = len(keypoints_2)
    percent_diff = abs(found_keypoints_1 - found_keypoints_2) / ((found_keypoints_1 + found_keypoints_2) / 2)

    #print('# of keypoints found in img1: {}, img2: {}'.format(found_keypoints_1, found_keypoints_2))

    #feature matching
    bf = cv2.BFMatcher(cv2.NORM_L1, crossCheck=True)
    matches = bf.match(descriptors_1,descriptors_2)
    matches = sorted(matches, key = lambda x:x.distance)
    #print('matches found: {}'.format(len(matches)))

    errorScore = calculateErrorScore(len(matches), found_keypoints_1, found_keypoints_2)
    #print('error score: {}'.format(errorScore))

    # error score (the lower the similar the images)
    # percent diff: percent diff btw keypoints found in 2 images
    # number of keypoints in img1 and img2
    return errorScore, percent_diff, keypoints_1, keypoints_2
