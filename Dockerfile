FROM ubuntu
COPY VERSION .
RUN apt-get update
CMD ["echo", "hello world"]
