FROM node:10.15.0-jessie

EXPOSE 5555

ENV APP_ROOT=/root/app-root \
    NODEJS_VERSION=8 \
    NPM_RUN=start \
    NAME=nodejs

ENV HOME=${APP_ROOT} \
    NPM_CONFIG_PREFIX=${APP_ROOT}/.npm 

COPY . ${APP_ROOT}

WORKDIR ${APP_ROOT}

RUN npm install && npm run prod:build
CMD node ./dist/server.js