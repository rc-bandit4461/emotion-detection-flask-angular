import os
from flask import Flask, flash, request, redirect, render_template, send_from_directory, send_file
from werkzeug.utils import secure_filename
from flask_cors import CORS
import flask
from w3lib.url import parse_data_uri
from flask_cors import cross_origin
import io
from base64 import decodestring
import json
import random
import numpy as np
import cv2
from emotion_detector import predict_image
app=Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "http://localhost:4200"}})
app.secret_key = "secret key"
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

path = os.getcwd()
# file Upload
UPLOAD_FOLDER = os.path.join(path, 'uploads')
TEMP_FOLDER = os.path.join(path, 'rendered')

if not os.path.isdir(TEMP_FOLDER):
    os.mkdir(TEMP_FOLDER)
if not os.path.isdir(UPLOAD_FOLDER):
    os.mkdir(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['TEMP_FOLDER'] = TEMP_FOLDER


ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@cross_origin(origin='*')
@app.route('/api/test')
def hello_world():
    return {'data':'salam'}

@cross_origin(origin='localhost')
@app.route('/matrix', methods=['POST'])
def matrix():
    content = request.get_json(silent=True)
    print(len(content))
    print(np.array(content['data']).shape)
    return {'resp':'OK'}


@cross_origin(origin='localhost')
@app.route('/upload', methods=['POST'])
def upload_file():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            # flash('No file part')
            return {'data':'No file part'}
        file = request.files['file']
        if file.filename == '':
            # flash('No file selected for uploading')
            return {'data':'No file selected for uploading'}
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(path)
            predicted_image, result_image = predict_image(path)
            _hash = str(random.getrandbits(128))
            cv2.imwrite('rendered/result_'+_hash+'.jpg', result_image)
            
            renders = os.path.join(app.root_path, app.config['TEMP_FOLDER'])
            # response = flask.jsonify({'some': 'data'})
            # response.headers.add('Access-Control-Allow-Origin', '*')
            # print(type(result_image))
            # return app.make_response((result_image.blob, 200,{'Access-Control-Allow-Origin':'*', 'Content-Type':'image/jpeg'}))
            # response =  send_file(io.BytesIO(result_image),
                            #  mimetype='image/jpeg',as_attachment=True,attachment_filename='%s.jpg' % 1000)
            # response.headers = {'Access-Control-Allow-Origin':'*', 'type':'image/jpeg'}
            # return response
    
            # response.content_type = 'image/jpeg'
            
            return send_from_directory(directory=renders, filename='result_'+_hash+'.jpg')
        else:
            # flash('Allowed file types are txt, pdf, png, jpg, jpeg, gif')
            return {'data':'Allowed file types are png, jpeg, jpg'}
            

if __name__ == "__main__":
    app.run(host = '127.0.0.1',port = 5000, debug = True)
    print("OK")
