FROM node:20-slim

RUN \
  apt update -y && \
  apt install -y openssl

WORKDIR /home/node/app

USER node

EXPOSE 3000
EXPOSE 5555

CMD [ "tail", "-f", "/dev/null" ]
