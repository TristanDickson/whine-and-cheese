FROM node:12.2.0-alpine
RUN apk add --no-cache bash
WORKDIR /
COPY package*.json ./
RUN yarn install
COPY . .
CMD ["yarn", "start"]
