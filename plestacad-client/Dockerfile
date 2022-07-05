FROM node:14-alpine as build-step

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

RUN npm run build

FROM nginx:1.17.1-alpine
COPY --from=build-step app/dist/plestacad-client /usr/share/nginx/html 
COPY /nginx.conf  /etc/nginx/conf.d/default.conf

EXPOSE 80
