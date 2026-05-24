FROM node:24-slim

WORKDIR /app

# Enable Corepack (recommended way for pnpm)
RUN corepack enable

# Copy only dependency files first for better caching
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./

# Install dependencies
RUN pnpm install

# Copy application files
COPY . .

EXPOSE 3000

CMD ["bash", "./start.sh"]