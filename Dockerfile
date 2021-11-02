# ---- Base Node ----
FROM node:14 AS base
WORKDIR /usr/src/app

# ---- Dependencies ----
FROM base AS dependencies

ARG BASE_PATH
ENV NODE_ENV=production \
    BASE_PATH=$BASE_PATH

COPY package*.json /usr/src/app/

# Install dependencies
RUN npm set progress=false && npm config set depth 0
RUN npm install --production=false

# ---- Build ----
FROM dependencies AS build
ARG BASE_PATH
ENV NODE_ENV=production \
    BASE_PATH=$BASE_PATH

COPY . /usr/src/app
RUN npm run build

# ---- Release ----
FROM build as release
ARG BASE_PATH
ENV PORT=3000 \
    NODE_ENV=production \
    BASE_PATH=$BASE_PATH

EXPOSE 3000
USER node

COPY --from=build /usr/src/app/ /usr/src/app/

CMD ["npm", "start"]