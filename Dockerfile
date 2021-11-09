FROM node:16 AS builder

WORKDIR /usr/src/app

COPY package*.json .npmrc /usr/src/app/
RUN --mount=type=secret,id=NODE_AUTH_TOKEN \
    NODE_AUTH_TOKEN=$(cat /run/secrets/NODE_AUTH_TOKEN) \
    npm ci --prefer-offline --no-audit --ignore-scripts

COPY . /usr/src/app

RUN npm run build && \
    npm prune --production --offline



COPY --from=dependencies /usr/src/app/node_modules ./node_modules
RUN --mount=type=secret,id=NODE_AUTH_TOKEN \
        NODE_AUTH_TOKEN=$(cat /run/secrets/NODE_AUTH_TOKEN) \
        npm run build


# ---- Runner ----
FROM node:16-alpine AS runtime

WORKDIR /usr/src/app

ARG BASE_PATH
ENV PORT=3000 \
    NODE_ENV=production \
    BASE_PATH=$BASE_PATH

COPY --from=builder /usr/src/app/ /usr/src/app/

EXPOSE 3000
USER node

CMD ["npm", "start"]
