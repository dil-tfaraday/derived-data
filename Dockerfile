# Build dashboard (aggregates synthetic org JSON into public/aggregate.json)
FROM node:20-alpine AS builder
WORKDIR /build
COPY risk_and_audit_test ./risk_and_audit_test
COPY dashboard ./dashboard
WORKDIR /build/dashboard
RUN npm ci && npm run build

# Runtime: static site + password-protected Express
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY server/package.json server/package-lock.json ./
RUN npm ci --omit=dev
COPY server/index.mjs ./
COPY --from=builder /build/dashboard/dist ./dist
EXPOSE 8080
CMD ["node", "index.mjs"]
