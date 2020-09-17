FROM node:14 AS builder

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json /usr/src/app/
RUN npm ci

COPY . /usr/src/app
RUN npm run build

FROM node:14-alpine AS runtime

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

USER node
ENV PORT 3000
EXPOSE 3000

COPY --from=builder /usr/src/app /usr/src/app

CMD "npm" "start"