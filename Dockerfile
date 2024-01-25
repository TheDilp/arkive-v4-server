# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 as base
WORKDIR /usr/src/app
ENV HUSKY=0
ENV NODE_ENV=production
COPY package.json bun.lockb /usr/src/app/
RUN bun install --production --force
RUN bunx dbmate migrate
RUN bun run kysely-codegen
COPY . .
# run the app
USER bun
EXPOSE 5174/tcp
ENTRYPOINT [ "bun", "run", "/usr/src/app/index.ts" ]
