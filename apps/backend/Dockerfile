# NestJS Backend Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package manifests
COPY package.json ./
COPY apps/backend/package.json ./apps/backend/
COPY apps/backend/prisma ./apps/backend/prisma

# Install dependencies & generate Prisma client
RUN npm install
RUN npm --prefix apps/backend run prisma:generate

# Copy source code & build NestJS
COPY apps/backend ./apps/backend
RUN npm --prefix apps/backend run build

# Production runtime stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=builder /app/apps/backend/prisma ./apps/backend/prisma

EXPOSE 4000
CMD ["node", "apps/backend/dist/main"]
