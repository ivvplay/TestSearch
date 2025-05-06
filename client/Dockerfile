FROM node:19-alpine
RUN apk add --no-cache curl

WORKDIR /client

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

CMD npm run preview
