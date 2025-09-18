# Dockerfile for Next.js application in order to run in every diff. machine
# Use official Node.js image as base
FROM node:18-alpine AS deps

# Set working directory
WORKDIR /app

# Install dependencies (only package files first for caching)
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
#support different package managers
RUN npm install --frozen-lockfile || yarn install --frozen-lockfile || pnpm install --frozen-lockfile

# Build the Next.js app
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM node:18-alpine AS runner
WORKDIR /app

# Set NODE_ENV to production
ENV NODE_ENV production

# Copy build output
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

# Start Next.js
  ### docker run -p 3000:3000 <my-nextjs-app (or image name)>
CMD ["npm", "start"]
