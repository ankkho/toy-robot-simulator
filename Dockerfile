FROM node:lts-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++ dumb-init

COPY package.json package-lock.json ./

RUN npm i --omit=dev

RUN chown -R node:node /app

USER node
COPY .env ./.env
COPY --chown=node:node ./dist ./dist

CMD [ "dumb-init", "node", "./dist/main.cli.js", "start" ]
