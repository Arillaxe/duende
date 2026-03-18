FROM node:20-bookworm-slim AS deps

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

RUN corepack enable

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:20-bookworm-slim AS builder

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

RUN corepack enable

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN yarn build

FROM node:20-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder --chown=node:node /app/package.json ./package.json
COPY --from=builder --chown=node:node /app/yarn.lock ./yarn.lock
COPY --from=builder --chown=node:node /app/next.config.js ./next.config.js
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next ./.next
COPY --from=builder --chown=node:node /app/node_modules ./node_modules

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 CMD node -e "const http=require('http');const req=http.get({host:'127.0.0.1',port:process.env.PORT||3000,path:'/api/health',timeout:3000},(res)=>{process.exit(res.statusCode===200?0:1)});req.on('error',()=>process.exit(1));req.on('timeout',()=>{req.destroy();process.exit(1);});"

USER node

CMD ["sh", "-c", "exec ./node_modules/.bin/next start -p ${PORT:-3000} -H ${HOSTNAME:-0.0.0.0}"]
