# Use stable, lightweight base image
# syntax=docker/dockerfile:1
FROM --platform=linux/amd64 python:3.11-slim


# Set working directory
WORKDIR /app

# Prevent interactive installs and upgrade tools
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y gcc && rm -rf /var/lib/apt/lists/*

# Copy requirements and install dependencies (with retries)
COPY requirements.txt .
RUN python -m pip install --upgrade pip setuptools wheel && \
    pip install --no-cache-dir --default-timeout=100 -r requirements.txt

# Copy the rest of your app
COPY . .

# Expose Flask port
EXPOSE 5000

# Run via Gunicorn (production)
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "server.server:app"]


