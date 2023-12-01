# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 as base
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds

FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
ENV HUSKY=0
RUN cd /temp/dev && bun install

# install
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
ENV HUSKY=0
RUN cd /temp/prod && bun install --production --force

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM install AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# [optional] tests & build
ENV NODE_ENV=production


# copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app .

# run the app
USER bun
EXPOSE 5174/tcp
ENTRYPOINT [ "bun", "run", "index.ts" ]
