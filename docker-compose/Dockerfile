# ---- Avhengigheter, endres sjeldent og caches ----
FROM node:16 AS deps
WORKDIR /app

COPY package*.json .npmrc ./

ARG PAT
ENV PAT $PAT
RUN echo '//npm.pkg.github.com/:_authToken='$PAT >> .npmrc

RUN npm install

# ---- Kjøring av appen, må få med seg alle endringer ----
FROM node:16-alpine AS runtime
WORKDIR /app

ARG BASE_PATH
ENV PORT=3001 \
    NODE_ENV=development

COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node package*.json .npmrc next.config.js tsconfig.json sanity-client.ts ./

EXPOSE 3001

CMD ["./node_modules/.bin/next", "dev"]
