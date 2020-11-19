#!/bin/bash
docker build -t alumni-connect .
docker rm alumni-connect-run
docker run -p 5000:5000 -v $PWD:/app:rw --name alumni-connect-run alumni-connect gunicorn wsgi:app -b 0.0.0.0:5000
