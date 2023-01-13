FROM node:18-alpine as build

WORKDIR /home/weektasks-app
COPY --chown=node:node package*.json ./
RUN npm install
COPY --chown=node:node . .
RUN npm run build
ENV NODE_ENV production
RUN npm ci --omit=dev && npm cache clean --force
USER node

FROM nginx:1.23.3-alpine AS app
COPY --from=build /home/weektasks-app/dist /usr/share/nginx/html
