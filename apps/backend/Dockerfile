FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl libc6-compat

# Copy package manifests & Prisma schema from monorepo
COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/
COPY apps/backend/prisma ./apps/backend/prisma/

# Install root & backend dependencies and generate Prisma client
RUN npm install
RUN npm --prefix apps/backend run prisma:generate

# Copy source code and build NestJS
COPY apps/backend ./apps/backend
RUN npm --prefix apps/backend run build

# Production runtime stage
FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache openssl libc6-compat

ENV NODE_ENV=production
ENV PORT=4000

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/package*.json ./apps/backend/
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/prisma ./apps/backend/prisma

EXPOSE 4000
CMD ["node", "apps/backend/dist/src/main.js"]
