# Next.js 15 Frontend Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json ./
COPY apps/frontend/package.json ./apps/frontend/

RUN npm install

COPY apps/frontend ./apps/frontend
RUN npm --prefix apps/frontend run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/frontend/.next ./apps/frontend/.next
COPY --from=builder /app/apps/frontend/public ./apps/frontend/public
COPY --from=builder /app/apps/frontend/package.json ./apps/frontend/package.json

EXPOSE 3000
CMD ["npm", "--prefix", "apps/frontend", "run", "start"]
