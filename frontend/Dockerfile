# --- Build Stage ---
FROM oven/bun:${BUN_VERSION:-1.2.8} AS builder

ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}
ENV NODE_ENV=production

WORKDIR /frontend

# Copy package files first for caching dependencies
COPY ./frontend/bun.lock /frontend/bun.lock
COPY ./frontend/package.json /frontend/package.json

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the frontend code
COPY ./frontend /frontend

# Build the frontend
RUN bun run build

# --- Serve Stage (Final Image)---
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Copy only the built files from the builder stage
COPY --from=builder /frontend/dist /usr/share/nginx/html

# Copy custom Nginx config
COPY ./frontend/nginx/nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
