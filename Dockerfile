FROM ubuntu
MAINTAINER ahmadk953
ADD VERSION .
RUN apt-get update
CMD ["echo", "hello world"]
