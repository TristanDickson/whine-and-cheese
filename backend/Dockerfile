FROM node:12.2.0-alpine
WORKDIR /
COPY package*.json ./
RUN yarn install
COPY . .
CMD ["yarn", "start"]
