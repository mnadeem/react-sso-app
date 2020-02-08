FROM node:10.19.0-jessie

EXPOSE 3000

ENV APP_ROOT=/root/app-root \
    NODEJS_VERSION=8 \
    NPM_RUN=start \
    NAME=nodejs

ENV HOME=${APP_ROOT} \
    NPM_CONFIG_PREFIX=${APP_ROOT}/.npm 


COPY . ${APP_ROOT}


WORKDIR ${APP_ROOT}

RUN npm install && npm run build

CMD node app_server.js