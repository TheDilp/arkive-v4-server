# Stage 1: Build stage
FROM oven/bun:1.1.20 AS builder
WORKDIR /usr/src/app
ENV HUSKY=0
ENV NODE_ENV=production
COPY . .
RUN bun install --production --force
RUN bun build ./index.ts --outdir ./dist --target bun --external 'sharp'

# Stage 2: Production stage
FROM oven/bun:1.1.20 AS sharp
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules/sharp ./node_modules/sharp
COPY --from=builder /usr/src/app/node_modules/semver ./node_modules/semver
COPY --from=builder /usr/src/app/public/Logo.webp ./public/Logo.webp
RUN bun install --include=optional sharp

FROM oven/bun:1.1.20
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY --from=sharp /usr/src/app ./
COPY --from=sharp /usr/src/app ./

USER bun
EXPOSE 5174/tcp
ENTRYPOINT [ "bun", "run", "./dist/index.js" ]
