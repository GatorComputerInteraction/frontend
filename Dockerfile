FROM docker.io/node:17-alpine as BUILDER

WORKDIR /app

ADD . .

RUN --mount=type=cache,target=/app/node_modules yarn install && NODE_ENV=production yarn build

FROM docker.io/nginxinc/nginx-unprivileged:1.20-alpine

COPY --from=BUILDER /app/dist /usr/share/nginx/html
