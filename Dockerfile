FROM node:16 AS builder
WORKDIR /usr/src/app

COPY package*.json .npmrc /usr/src/app/

RUN --mount=type=secret,id=NODE_AUTH_TOKEN \
    echo '//npm.pkg.github.com/:_authToken='$(cat /run/secrets/NODE_AUTH_TOKEN) >> .npmrc

RUN --mount=type=secret,id=SANITY_ACCESS_TOKEN \
    echo 'SANITY_ACCESS_TOKEN='$(cat /run/secrets/SANITY_ACCESS_TOKEN) >> .env.local

RUN --mount=type=secret,id=SANITY_ACCESS_TOKEN \
    echo 'DEKORATOR_ENV='$DEKORATOR_ENV >> .env.local
RUN npm ci

COPY . /usr/src/app
RUN npm run build


# ---- Runner ----
FROM node:16-alpine AS runtime
WORKDIR /usr/src/app

ARG BASE_PATH
ENV PORT=3000 \
    NODE_ENV=production

COPY --from=builder /usr/src/app/ /usr/src/app/

EXPOSE 3000
USER node

CMD ["./node_modules/.bin/next", "start"]
