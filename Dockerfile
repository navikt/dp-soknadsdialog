# ---- Dependencies ----
FROM node:14 AS dependencies
WORKDIR /usr/src/app
ARG BASE_PATH
ENV NODE_ENV=production \
    BASE_PATH=$BASE_PATH

COPY package*.json /usr/src/app/

# Install dependencies
RUN npm set progress=false && npm config set depth 0
RUN npm install --production=false

# ---- Build ----
FROM dependencies AS builder
WORKDIR /usr/src/app
COPY . .
ARG BASE_PATH
ENV NODE_ENV=production \
    BASE_PATH=$BASE_PATH

COPY --from=dependencies /usr/src/app/node_modules ./node_modules
RUN npm run build

# ---- Runner ----
FROM node:14-alpine AS runner
WORKDIR /usr/src/app

ARG BASE_PATH
ENV PORT=3000 \
    NODE_ENV=production \
    BASE_PATH=$BASE_PATH

EXPOSE 3000
USER node

COPY --from=builder /usr/src/app/ /usr/src/app/

CMD ["npm", "start"]