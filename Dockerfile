FROM node:16 AS builder
WORKDIR /usr/src/app

COPY package*.json .npmrc /usr/src/app/

RUN --mount=type=secret,id=NODE_AUTH_TOKEN \
    echo '//npm.pkg.github.com/:_authToken='$(cat /run/secrets/NODE_AUTH_TOKEN) >> .npmrc

RUN npm ci

COPY . /usr/src/app

RUN echo "---BUILDER----"$NEXT_PUBLIC_SENTRY_STAGE"-------"
ARG SENTRY_RELEASE
RUN --mount=type=secret,id=SENTRY_AUTH_TOKEN \
    echo "[auth]\n"\
         "token=$(cat /run/secrets/SENTRY_AUTH_TOKEN)" >> .sentryclirc && \
    npm run build

# ---- Runner ----
FROM node:16-alpine AS runtime
WORKDIR /usr/src/app

RUN echo "---RUNNER----"$NEXT_PUBLIC_SENTRY_STAGE"-------"

ARG BASE_PATH
ENV PORT=3000 \
    NODE_ENV=production

COPY --from=builder /usr/src/app/ /usr/src/app/

EXPOSE 3000
USER node

CMD ["./node_modules/.bin/next", "start"]
