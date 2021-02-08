import os
from flask import Flask, flash, request, redirect, render_template
from werkzeug.utils import secure_filename
from flask_cors import CORS
from flask_cors import cross_origin
app=Flask(__name__)
cors = CORS(app)
app.secret_key = "secret key"
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

path = os.getcwd()
# file Upload
UPLOAD_FOLDER = os.path.join(path, 'uploads')

if not os.path.isdir(UPLOAD_FOLDER):
    os.mkdir(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# @cross_origin(origin='*')
@app.route('/api/test')
def hello_world():
    return {'data':'salam'}



@app.route('/upload', methods=['POST'])
def upload_file():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            # flash('No file part')
            return {'data':'No file'}
        file = request.files['file']
        if file.filename == '':
            # flash('No file selected for uploading')
            return {'data':'No file selected for uploading'}
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            # flash('File successfully uploaded')
            return {'data':'file uploaded successfully'}
        else:
            # flash('Allowed file types are txt, pdf, png, jpg, jpeg, gif')
            return {'data':'Allowed file types are txt, pdf, png, jpg, jpeg, gif'}


if __name__ == "__main__":
    app.run(host = '127.0.0.1',port = 5000, debug = True)
    print("OK")
