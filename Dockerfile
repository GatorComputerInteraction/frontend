FROM docker.io/node:17-alpine as BUILDER

WORKDIR /app

ADD . .

RUN --mount=type=cache,target=/app/node_modules yarn install && NODE_OPTIONS=--openssl-legacy-provider NODE_ENV=production yarn build

FROM docker.io/nginxinc/nginx-unprivileged:1.20-alpine

COPY --from=BUILDER /app/dist /usr/share/nginx/html
COPY --from=BUILDER /app/nginx.conf /etc/nginx/nginx.conf
