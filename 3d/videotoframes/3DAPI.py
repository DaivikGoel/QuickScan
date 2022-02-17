from flask import Flask

from videotoframe import videotoframe 



#to run the flask server, run commands below in terminal under the video to frames
# export FLASK_APP=3DAPI
# flask run


app = Flask(__name__)

@app.route("/")
def homepage():
    return "<p>Welcome to the QuickScan API</p>"

@app.route("/run_model")
def run_model():
    videotoframe()
    
    return "<p> Running Model to Frames </p>"