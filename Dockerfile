FROM node:18

WORKDIR /usr/src/rsaserver

COPY package*.json ./

RUN npm install

COPY . .

COPY ./rsaclient/* ./rsaclient

RUN cd rsaclient && npm install && cd ..

EXPOSE 5000

CMD ["node","app.js"]

