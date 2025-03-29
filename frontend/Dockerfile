FROM oven/bun:${BUN_VERSION:-1.2.7}

ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}
ENV NODE_ENV=production


WORKDIR /frontend

COPY ./frontend/bun.lock /frontend/bun.lock
COPY ./frontend/package.json /frontend/package.json
COPY ./frontend/tsconfig.json /frontend/tsconfig.json
COPY ./frontend/tsconfig.app.json /frontend/tsconfig.app.json
COPY ./frontend/tsconfig.node.json /frontend/tsconfig.node.json


RUN bun install --frozen-lockfile

RUN bun i -g serve

COPY ./frontend /frontend

RUN bun run build

EXPOSE 3000

CMD ["serve", "-l", "3000", "dist"]
