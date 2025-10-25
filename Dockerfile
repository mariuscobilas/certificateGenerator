FROM node:20-slim AS builder
WORKDIR /app

# Install build-time dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy built assets
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose port and run
EXPOSE 3000
CMD ["npm", "start"]
