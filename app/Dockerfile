FROM node:20-alpine AS builder
WORKDIR /usr/src/app
# enable corepack and activate pnpm for consistent installs
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --prod --shamefully-hoist
COPY . .

FROM node:20-alpine
WORKDIR /usr/src/app
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
COPY --from=builder /usr/src/app .
ENV NODE_ENV=production
EXPOSE 4000
CMD ["node", "src/main.js"]
