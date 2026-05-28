# FROM python:3.13-bookworm

# ENV UV_COMPILE_BYTECODE=1 \
#     UV_LINK_MODE=copy \
#     PYTHONUNBUFFERED=1 \
#     UV_SYSTEM_PYTHON=1

# WORKDIR /app

# RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates

# ADD https://astral.sh/uv/install.sh /uv-installer.sh
# RUN sh /uv-installer.sh && rm /uv-installer.sh


# COPY pyproject.toml uv.lock ./

# RUN --mount=type=cache,target=/root/.cache/uv \
#     uv sync --frozen --no-install-project --no-dev

# ENV PATH="/app/.venv/bin:$PATH"

# COPY . .

# EXPOSE 8000

# CMD ["bash", "./start.sh"]

FROM ghcr.io/astral-sh/uv:python3.11-bookworm-slim

ENV UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    PYTHONUNBUFFERED=1 \
    UV_SYSTEM_PYTHON=1

WORKDIR /app

COPY pyproject.toml uv.lock ./

RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-dev

COPY . .

ENV PATH="/app/.venv/bin:$PATH"

EXPOSE 8000

CMD ["bash", "./start.sh"]
