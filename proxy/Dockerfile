FROM node:20-alpine AS builder
WORKDIR /usr/src/proxy
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --prod --shamefully-hoist
COPY . .

FROM node:20-alpine
WORKDIR /usr/src/proxy
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
COPY --from=builder /usr/src/proxy .
ENV NODE_ENV=production
EXPOSE 4100
CMD ["node", "src/index.js"]
