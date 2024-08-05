FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json .

RUN npm ci

COPY . .

EXPOSE 5500

CMD [ "npm", "run", "dev" ]