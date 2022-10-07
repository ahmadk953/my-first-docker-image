FROM ubuntu
MAINTAINER ahmadk953
COPY VERSION .
RUN apt-get update
CMD ["echo", "hello world"]
