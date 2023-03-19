FROM node:16-alpine

WORKDIR /app

ADD package.json .
RUN npm install

ADD ./ ./

EXPOSE 8080

RUN npm run build

CMD ["npm", "run", "preview"]