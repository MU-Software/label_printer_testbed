# Frontend Builder
FROM node:23-slim AS frontend-builder
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY ../frontend /app
RUN rm -rf /app/node_modules
WORKDIR /app
RUN pnpm fetch
RUN pnpm install -r --offline
RUN pnpm run build

# ==============================================================================
FROM python:3.13-alpine AS runtime
SHELL [ "/bin/sh", "-euxvc"]

ARG GIT_HASH
ENV TZ=Asia/Seoul \
    LANG=C.UTF-8 \
    LC_ALL=C.UTF-8 \
    PYTHONIOENCODING=UTF-8 \
    PYTHONUNBUFFERED=1 \
    UV_COMPILE_BYTECODE=1 \
    UV_CONCURRENT_DOWNLOADS=32 \
    UV_LINK_MODE=copy \
    UV_PYTHON_DOWNLOADS=0 \
    PATH="${PATH}:/root/.local/bin:"

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Install dependencies
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/
COPY --chown=nobody:nobody ../backend/pyproject.toml ../backend/uv.lock /src/
WORKDIR /src
RUN --mount=type=cache,target=/root/.cache/uv \
    apk add --no-cache bash gcc usbutils udev \
    && uv sync --no-default-groups --frozen

# Make docker to always copy app directory so that source code can be refreshed.
ARG GIT_HASH=unknown
ARG IMAGE_BUILD_DATETIME=unknown
ENV DEPLOYMENT_GIT_HASH=$GIT_HASH
ENV DEPLOYMENT_IMAGE_BUILD_DATETIME=$IMAGE_BUILD_DATETIME

# Copy main app
COPY ../backend/src/ /src/

# Copy frontend build
COPY --from=frontend-builder /app/dist /src/static

# Run the application
# ARG WORKERS=4
CMD [ "python3.13", "-m", "src", "--host", "0.0.0.0", "--port", "8000" ]
