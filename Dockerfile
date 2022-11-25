FROM node:16-alpine AS runtime
WORKDIR /usr/src/app

ARG BASE_PATH
ENV PORT=3000 \
    NODE_ENV=production \
    TZ=Europe/Oslo

COPY next.config.js ./
COPY package.json ./

COPY public ./public
COPY .next/standalone ./
COPY .next/static ./.next/static

RUN sed -i '/"STATIC_ASSET_PREFIX"/process.env.ASSET_PREFIX/i' ./server.js

EXPOSE 3000
USER node

CMD ["node", "server.js"]
