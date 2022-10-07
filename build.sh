set -ex
# SET THE FOLLOWING VARIABLES
# docker hub username
USERNAME=akhaneducation
# image name
IMAGE=myfirstimage
docker build -t $USERNAME/$IMAGE:latest .
