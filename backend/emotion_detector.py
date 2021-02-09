from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import os
import cv2
import tensorflow as tf
from os import listdir
from os.path import isfile, join
from tensorflow.keras.preprocessing.image import img_to_array, array_to_img
import pickle as pkl
print(tf.__version__)
class_labels = pkl.load(open('checkpoint/class_labels.pkl','rb'))
face_classifier = cv2.CascadeClassifier('./haarcascades/haarcascade_frontalface_default.xml')
classifier = load_model('./checkpoint/emotion_model.h5')

def face_detector(img):
    
    gray = cv2.cvtColor(img.copy(), cv2.COLOR_BGR2GRAY)
    faces = face_classifier.detectMultiScale(gray, 1.3, 5)
    if faces is ():
        return (0,0,0,0), np.zeros((48,48), np.uint8), img
    
    allfaces = []
    rects = []
    for(x,y,w,h) in faces:
        
        cv2.rectangle(img, (x,y), (x+w,y+h), (255,0,0), 2)
        roi_gray = gray[y:y+h, x:x+w]
        roi_gray = cv2.resize(roi_gray, (48,48), interpolation = cv2.INTER_AREA)
        allfaces.append(roi_gray)
        rects.append((x,w,y,h))
    return rects,allfaces, img

def predict_image(img_path):
    img = cv2.imread(img_path)
    rects, faces, image = face_detector(img)
    i=0
    for face in faces:
        print(face[0])
        roi = face.astype("float") / 255.0
        roi = img_to_array(roi)
        roi = np.expand_dims(roi, axis=0)
        
        preds = classifier.predict(roi)[0]
        label = class_labels[preds.argmax()]
        
        label_position = (rects[i][0] + int ((rects[i][1]/2)), abs(rects[i][2] - 10))
        i+=1
        cv2.putText(image, label, label_position, cv2.FONT_HERSHEY_SIMPLEX, 1, (0,255,0), 3)
        
    image = image[:,:,::-1]
    print(image.shape)
    return array_to_img(image), img

