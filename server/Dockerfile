FROM node:19-alpine

WORKDIR /server

COPY package*.json .

RUN npm install

COPY . .

CMD npm run start