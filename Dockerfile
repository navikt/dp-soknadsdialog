FROM node:16 AS builder
WORKDIR /usr/src/app

COPY package*.json .npmrc /usr/src/app/

RUN --mount=type=secret,id=NODE_AUTH_TOKEN \
    echo '//npm.pkg.github.com/:_authToken='$(cat /run/secrets/NODE_AUTH_TOKEN) >> .npmrc

RUN npm ci

COPY . /usr/src/app

ARG SENTRY_RELEASE
RUN --mount=type=secret,id=SENTRY_AUTH_TOKEN \
    echo "[auth]\n"\
         "token=$(cat /run/secrets/SENTRY_AUTH_TOKEN)" >> .sentryclirc && \
    npm run build

# ---- Runner ----
FROM node:16-alpine AS runtime
WORKDIR /usr/src/app

ARG BASE_PATH
ARG NEXT_PUBLIC_SENTRY_ENV
ENV PORT=3000 \
    NODE_ENV=production

COPY --from=builder /usr/src/app/ /usr/src/app/
RUN echo "NEXT_PUBLIC_SENTRY_ENV=$NEXT_PUBLIC_SENTRY_ENV" >> .env.production

EXPOSE 3000
USER node

CMD ["./node_modules/.bin/next", "start"]
