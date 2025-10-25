FROM node:20-alpine AS builder
WORKDIR /usr/src/proxy
COPY package.json package-lock.json* ./
RUN npm ci --production
COPY . .

FROM node:20-alpine
WORKDIR /usr/src/proxy
COPY --from=builder /usr/src/proxy .
ENV NODE_ENV=production
EXPOSE 4100
CMD ["node", "src/index.js"]
