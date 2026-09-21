FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl libc6-compat

# Copy root & backend package files
COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/
COPY apps/backend/prisma ./apps/backend/prisma/

# Install backend dependencies and generate Prisma client
RUN cd apps/backend && npm install && npx prisma generate

# Copy backend source and compile NestJS
COPY apps/backend ./apps/backend
RUN cd apps/backend && npm run build

# Production runtime stage
FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache openssl libc6-compat

ENV NODE_ENV=production
ENV PORT=4000

COPY --from=builder /app/apps/backend/package*.json ./apps/backend/
COPY --from=builder /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/prisma ./apps/backend/prisma

WORKDIR /app/apps/backend
EXPOSE 4000
CMD ["node", "dist/src/main.js"]
