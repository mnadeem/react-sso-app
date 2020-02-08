FROM node:10-15-1-jessie

EXPOSE 3000

ENV APP_ROOT=/root/app-root \
    NODEJS_VERSION=8 \
    NPM_RUN=start \
    NAME=nodejs

ENV HOME=${APP_ROOT}} \
    NPM_CONFIG_PREFIX=${APP_ROOT}/.npm 


COPY . ${APP_ROOT}

RUN mkdir -p ${APP_ROOT} && \
    mkdir -p ${APP_ROOT}/.npm && \
    chown -R 1001:0 $${APP_ROOT} && \
    chmod -R ug+rwx ${APP_ROOT}

USER 1001

WORKDIR ${APP_ROOT}

RUN npm install && npm run build

CMD node app_server.js