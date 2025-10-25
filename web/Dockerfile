FROM node:20-alpine AS builder
WORKDIR /usr/src/web
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /usr/src/web
RUN npm install -g serve
COPY --from=builder /usr/src/web/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
