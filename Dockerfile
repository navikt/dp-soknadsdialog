FROM node:16 AS builder
WORKDIR /usr/src/app

COPY package*.json .npmrc /usr/src/app/

RUN --mount=type=secret,id=NODE_AUTH_TOKEN \
    NODE_AUTH_TOKEN=$(cat /run/secrets/NODE_AUTH_TOKEN) \
    npm ci --prefer-offline --no-audit --ignore-scripts

# Kjør prepare uten NODE_AUTH_TOKEN tilgjengelig
RUN npm rebuild && npm run prepare --if-present

COPY . /usr/src/app

RUN --mount=type=secret,id=SENTRY_AUTH_TOKEN \
    SENTRY_AUTH_TOKEN=$(cat /run/secrets/SENTRY_AUTH_TOKEN) \
    npm run build

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

COPY --from=builder /usr/src/app/public ./public

EXPOSE 3000
USER node

CMD ["node", "server.js"]
