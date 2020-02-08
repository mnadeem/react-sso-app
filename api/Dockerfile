FROM node:10.19.0-jessie

EXPOSE 5544

ENV APP_ROOT=/root/app-root \
    NODEJS_VERSION=8 \
    NPM_RUN=start \
    NAME=nodejs

ENV HOME=${APP_ROOT}} \
    NPM_CONFIG_PREFIX=${APP_ROOT}/.npm 

RUN mkdir -p ${APP_ROOT} && \
    mkdir -p ${APP_ROOT}/.npm && \
    chown -R 1001:0 $${APP_ROOT} && \
    chmod -R ug+rwx ${APP_ROOT}

COPY . ${APP_ROOT}

USER 1001

WORKDIR ${APP_ROOT}

RUN npm install && npm run prod