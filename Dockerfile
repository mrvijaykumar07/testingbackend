FROM node:18-slim

WORKDIR /app

# Set timezone
RUN apt-get update && apt-get install -y tzdata && \
    ln -snf /usr/share/zoneinfo/Asia/Kolkata /etc/localtime && \
    echo "Asia/Kolkata" > /etc/timezone && \
    rm -rf /var/lib/apt/lists/*
ENV TZ=Asia/Kolkata

# Set environment
ENV NODE_ENV=production

# Copy dependency definitions
COPY package*.json ./

# Install production dependencies
RUN npm ci

# Copy source code
COPY . ./

EXPOSE 8080

# Run the app
CMD ["npm", "run", "production"]
