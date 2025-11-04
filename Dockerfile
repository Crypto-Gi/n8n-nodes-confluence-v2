FROM n8nio/n8n:latest

# Set working directory
WORKDIR /tmp

# Install git (if not already present)
USER root
RUN apk add --no-cache git

# Switch back to node user
USER node

# Clone the repository (will be updated with your GitHub URL)
ARG GITHUB_REPO=https://github.com/YOUR_USERNAME/n8n-nodes-confluence-v2.git
ARG BRANCH=main

RUN git clone --depth 1 --branch ${BRANCH} ${GITHUB_REPO} /tmp/n8n-nodes-confluence-v2

# Install dependencies and build
WORKDIR /tmp/n8n-nodes-confluence-v2
RUN npm install && npm run build

# Install the node in n8n
WORKDIR /home/node/.n8n
RUN mkdir -p node_modules && \
    cd node_modules && \
    ln -s /tmp/n8n-nodes-confluence-v2 n8n-nodes-confluence-v2

# Set environment variables
ENV N8N_COMMUNITY_PACKAGES_ENABLED=true

# Return to home directory
WORKDIR /home/node

# Expose n8n port
EXPOSE 5678

# Start n8n
CMD ["n8n"]
