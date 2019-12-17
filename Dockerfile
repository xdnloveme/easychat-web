FROM node:10
COPY ./ /app
WORKDIR /app
ARG registry=https://registry.npm.taobao.org
ARG disturl=https://npm.taobao.org/dist
RUN npm config set disturl $disturl
RUN npm config set registry $registry
RUN npm install && npm run build

FROM nginx
RUN mkdir /app
COPY --from=0 /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf