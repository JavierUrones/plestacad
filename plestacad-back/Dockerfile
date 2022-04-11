FROM node:14-alpine as build-step

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

CMD [ "npm","start" ]

