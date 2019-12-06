FROM node

WORKDIR /app

COPY package*.json ./

RUN npm install --verbose

COPY . /app

EXPOSE 4000

CMD ["npm", "start"]