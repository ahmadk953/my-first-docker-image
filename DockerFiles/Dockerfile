FROM ubuntu
COPY VERSION .
RUN apt-get update && apt-get clean
RUN adduser --disabled-password myuser
USER myuser
CMD ["echo", "hello world"]
