FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG PORT
ENV PORT=${APP_PORT}

ARG MONGO_URI
ENV MONGO_URI=${MONGO_URI}

ARG JWT_SECRET
ENV JWT_SECRET=${JWT_SECRET}

RUN npm run build

EXPOSE ${APP_PORT}

CMD ["node", "dist/index.js"]