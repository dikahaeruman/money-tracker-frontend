# Build stage
FROM oven/bun:1.2-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --verbose

# Copy application code and build
COPY . .

# Define environment variables
ARG NEXT_PUBLIC_BASE_AI_URL=http://207.211.157.0:8000
ARG NEXT_PUBLIC_BASE_URL=http://207.211.157.0/api
ARG BASE_URL=http://207.211.157.0/api

ENV NEXT_PUBLIC_BASE_AI_URL=$NEXT_PUBLIC_BASE_AI_URL
ENV BASE_URL=$BASE_URL
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL

# Build Next.js application
RUN bun run build-no-lint

# Remove Next.js cache to reduce image size
RUN rm -rf /app/.next/cache

# Production stage
FROM oven/bun:1.2-alpine

# Create a non-root user to run the app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Install only essential runtime dependencies
RUN apk add --no-cache curl

# Copy only necessary files from the builder stage
COPY --from=builder /app/package.json ./
COPY --from=builder /app/bun.lock ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# Install production dependencies only
RUN NODE_ENV=production bun install --production --frozen-lockfile --ignore-scripts --verbose

# Clean up unnecessary files (e.g., docs, test files)
RUN rm -rf /app/docs /app/tests /app/scripts /app/migrations /app/coverage

# Switch to the non-root user for security reasons
USER appuser

# Expose port
EXPOSE 3000

# Run the application using Bun
CMD ["bun", "run", "standalone"]
