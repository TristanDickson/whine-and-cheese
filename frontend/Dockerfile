# FROM node:12.2.0-alpine
# WORKDIR /
# COPY package*.json ./
# RUN yarn install
# COPY . .
# CMD ["yarn", "start"]

FROM node:12.2.0-alpine AS builder
WORKDIR /
COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn build

FROM node:12.2.0-alpine
RUN apk add --no-cache bash
RUN yarn global add serve
WORKDIR /
COPY --from=builder /build .
CMD ["serve", "-p", "3000", "-s", "."]