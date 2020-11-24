#!/bin/bash

docker build -t nyudevops/alumniconnect:latest .

export PORT=5000
export LOCAL_PORT=5000

# docker rm -f alumni-connect-run
docker run --env PORT=$PORT -p $LOCAL_PORT:$PORT --name alumni-connect-run nyudevops/alumniconnect:latest