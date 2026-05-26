FROM python:3.13-bookworm

WORKDIR /app

# Install system packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install uv
ADD https://astral.sh/uv/install.sh /uv-installer.sh

RUN sh /uv-installer.sh && rm /uv-installer.sh

ENV PATH="/root/.local/bin:$PATH"

# Copy dependency files first for Docker cache
COPY pyproject.toml uv.lock ./

# Install dependencies
RUN uv sync --frozen --no-dev

# Use venv created by uv
ENV PATH="/app/.venv/bin:$PATH"

# Copy app files
COPY . .

# Make startup script executable
RUN chmod +x start.sh

EXPOSE 8000

CMD ["bash", "./start.sh"]