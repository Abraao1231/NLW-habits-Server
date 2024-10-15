FROM node:20

WORKDIR /app

COPY package.json .

RUN npm install 

COPY . . 

EXPOSE 3333
EXPOSE 5555

CMD [ "npm", "run", "dev" ]