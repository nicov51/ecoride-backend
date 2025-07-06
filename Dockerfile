FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Installe ts-node et nodemon pour hot-reload
RUN npm install -g ts-node nodemon

CMD ["npm", "run", "start:dev"]