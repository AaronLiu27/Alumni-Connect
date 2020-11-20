#!/bin/bash

docker build -t frontenddocker . 

export PORT=3000
export LOCAL_PORT=8000

docker rm -f reactindocker
docker run -p $LOCAL_PORT:$PORT --name reactindocker frontenddocker