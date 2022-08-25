FROM node:16 AS builder
WORKDIR /usr/src/app

COPY package*.json .npmrc /usr/src/app/

RUN --mount=type=secret,id=NODE_AUTH_TOKEN \
    echo '//npm.pkg.github.com/:_authToken='$(cat /run/secrets/NODE_AUTH_TOKEN) >> .npmrc

RUN npm ci

COPY . /usr/src/app

RUN --mount=type=secret,id=SENTRY_AUTH_TOKEN \
    echo "[auth]\n"\
         "token=$(cat /run/secrets/SENTRY_AUTH_TOKEN)" >> .sentryclirc
RUN npm run build
RUN rm -f .sentryclirc

# ---- Runner ----
FROM node:16-alpine AS runtime
WORKDIR /usr/src/app

ARG BASE_PATH
ENV PORT=3000 \
    NODE_ENV=production \
    TZ=Europe/Oslo

COPY --from=builder /usr/src/app/next.config.js ./
COPY --from=builder /usr/src/app/package.json ./

COPY --from=builder /usr/src/app/.next/standalone ./
COPY --from=builder /usr/src/app/.next/static ./.next/static

EXPOSE 3000
USER node

CMD ["node", "server.js"]
