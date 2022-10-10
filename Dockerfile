FROM ubuntu
RUN apt-get update && apt-get clean && apt-get purge && rm -f -r /var/lib/dpkg/status
RUN adduser --disabled-password myuser
USER myuser
CMD ["echo", "hello world"]
