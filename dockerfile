FROM node:20-alpine AS base

RUN corepack enable && corepack prepare pnpm@latest --activate

# Dependencies stage
FROM base AS deps
RUN apk update && apk upgrade --no-cache
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# Builder stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build arguments with default values
ARG NEXT_PUBLIC_GCP_API_KEY
ARG NEXT_PUBLIC_GCP_AUTH_DOMAIN
ARG NEXT_PUBLIC_GCP_PROJECT_ID
ARG NEXT_PUBLIC_GCP_BUCKET

# Set as environment variables for Next.js build
ENV NEXT_PUBLIC_GCP_API_KEY=$NEXT_PUBLIC_GCP_API_KEY
ENV NEXT_PUBLIC_GCP_AUTH_DOMAIN=$NEXT_PUBLIC_GCP_AUTH_DOMAIN
ENV NEXT_PUBLIC_GCP_PROJECT_ID=$NEXT_PUBLIC_GCP_PROJECT_ID
ENV NEXT_PUBLIC_GCP_BUCKET=$NEXT_PUBLIC_GCP_BUCKET

RUN pnpm run build

# Runner stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3001

ENV PORT 3001

CMD ["node", "server.js"]