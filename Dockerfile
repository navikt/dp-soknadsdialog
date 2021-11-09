# ---- Dependencies ----
FROM node:16 AS dependencies
WORKDIR /usr/src/app
ARG BASE_PATH
ENV NODE_ENV=production \
    BASE_PATH=$BASE_PATH

COPY package*.json .npmrc /usr/src/app/
RUN --mount=type=secret,id=NODE_AUTH_TOKEN \
    NODE_AUTH_TOKEN=$(cat /run/secrets/NODE_AUTH_TOKEN) \
    npm ci --prefer-offline --no-audit --ignore-scripts

# ---- Build ----
FROM dependencies AS builder
COPY . /usr/src/app
WORKDIR /usr/src/app
ARG BASE_PATH
ENV NODE_ENV=production \
    BASE_PATH=$BASE_PATH

COPY --from=dependencies /usr/src/app/node_modules ./node_modules
RUN npm run build

# ---- Runner ----
FROM node:16-alpine AS runner
WORKDIR /usr/src/app

ARG BASE_PATH
ENV PORT=3000 \
    NODE_ENV=production \
    BASE_PATH=$BASE_PATH

COPY --from=builder /usr/src/app/ /usr/src/app/

EXPOSE 3000
USER node

CMD ["npm", "start"]
