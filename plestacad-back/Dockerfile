FROM node:14-alpine as build-step

WORKDIR /usr/src/app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 5200

CMD [ "npm","start" ]

