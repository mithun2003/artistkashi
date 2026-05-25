FROM node:24-slim

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./

RUN pnpm install --no-frozen-lockfile

COPY . .

# Switch to non-root AFTER everything is copied and installed
RUN chown -R node:node /app

USER node

EXPOSE 3000

CMD ["bash", "./start.sh"]