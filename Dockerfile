FROM node:lts

WORKDIR /app

COPY package.json .

RUN npm install 

COPY . . 

# RUN npx run migrate dev --name init

CMD [ "npm", "run", "dev" ]