#!/bin/bash

docker build -t frontenddocker . 

docker rm -f reactindocker
docker run -p 8000:3000 --name reactindocker frontenddocker