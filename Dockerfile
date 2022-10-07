FROM ubuntu
COPY VERSION .
RUN apt-get update && apt-get clean
CMD ["echo", "hello world"]
