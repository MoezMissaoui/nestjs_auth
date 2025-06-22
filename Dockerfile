FROM node:20-alpine AS base
WORKDIR /usr/src/app

FROM base AS dependencies
COPY package.json package-lock.json* ./
RUN npm ci

FROM base AS build
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS seeder
COPY --from=build /usr/src/app/dist ./dist
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY package.json .

FROM base AS production
ENV NODE_ENV=production
COPY --from=dependencies /usr/src/app/package.json /usr/src/app/package-lock.json* ./
RUN npm ci --omit=dev
COPY --from=build /usr/src/app/dist ./dist

RUN addgroup --system --gid 1001 appgroup && \
    adduser --system --uid 1001 appuser --ingroup appgroup
USER appuser

EXPOSE 3000
CMD ["node", "dist/src/main"]