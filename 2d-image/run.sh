#!/bin/bash
echo "Run 2d image detection script: "

# Setup Google Vision API credential key
export GOOGLE_APPLICATION_CREDENTIALS="api_key/solar-icon-319404-c5165d8e60d1.json"

# Run python file
python3.8 imagedetect.py