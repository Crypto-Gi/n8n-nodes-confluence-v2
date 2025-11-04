# Docker Setup with GitHub Auto-Update

This guide shows how to run n8n with the Confluence V2 node automatically pulled from GitHub.

## Quick Start

### Step 1: Upload to GitHub

```bash
cd /Users/abdul-macmini/Desktop/Code\ Repo/n8n-node-confluence

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: n8n Confluence V2 node"

# Create repository on GitHub (via web interface)
# Then add remote and push
git remote add origin https://github.com/YOUR_USERNAME/n8n-nodes-confluence-v2.git
git branch -M main
git push -u origin main
```

### Step 2: Update Docker Files

Edit `Dockerfile` and `docker-compose.yml`:
- Replace `YOUR_USERNAME` with your GitHub username

### Step 3: Build and Run

```bash
# Build the custom n8n image
docker-compose build

# Start n8n
docker-compose up -d

# View logs
docker-compose logs -f
```

### Step 4: Access n8n

Open browser: http://localhost:5678

Default credentials (change in docker-compose.yml):
- Username: `admin`
- Password: `admin`

---

## Updating the Node

When you update code on GitHub:

```bash
# Rebuild with latest code from GitHub
docker-compose build --no-cache

# Restart
docker-compose up -d
```

---

## Alternative: Direct GitHub Clone

If you prefer not to use Docker build args:

### Dockerfile (Simpler Version)

```dockerfile
FROM n8nio/n8n:latest

USER root
RUN apk add --no-cache git
USER node

# Clone your repo directly
RUN git clone https://github.com/YOUR_USERNAME/n8n-nodes-confluence-v2.git /tmp/custom-node && \
    cd /tmp/custom-node && \
    npm install && \
    npm run build && \
    cd /home/node/.n8n && \
    mkdir -p node_modules && \
    cd node_modules && \
    ln -s /tmp/custom-node n8n-nodes-confluence-v2

ENV N8N_COMMUNITY_PACKAGES_ENABLED=true

EXPOSE 5678
CMD ["n8n"]
```

---

## Development Workflow

### 1. Make Changes Locally
```bash
# Edit your code
vim nodes/ConfluenceV2/ConfluenceV2.node.ts

# Test locally
npm run build
```

### 2. Push to GitHub
```bash
git add .
git commit -m "Update: description of changes"
git push origin main
```

### 3. Update Docker Container
```bash
# Rebuild with latest code
docker-compose build --no-cache

# Restart
docker-compose restart
```

---

## Troubleshooting

### Node not appearing in n8n

1. **Check if node is installed**:
   ```bash
   docker exec -it n8n-with-confluence ls -la /home/node/.n8n/node_modules | grep confluence
   ```

2. **Check build logs**:
   ```bash
   docker-compose logs n8n
   ```

3. **Verify community packages enabled**:
   ```bash
   docker exec -it n8n-with-confluence env | grep N8N_COMMUNITY
   ```

### Build fails

1. **Check GitHub repository is public**
2. **Verify repository URL is correct**
3. **Check network connectivity**:
   ```bash
   docker-compose build --no-cache --progress=plain
   ```

### Node loads but has errors

1. **Check n8n logs**:
   ```bash
   docker-compose logs -f n8n
   ```

2. **Verify TypeScript compiled**:
   ```bash
   docker exec -it n8n-with-confluence ls -la /tmp/n8n-nodes-confluence-v2/dist
   ```

---

## Production Considerations

### Use Specific Branch/Tag

Instead of `main`, use a specific version:

```yaml
# docker-compose.yml
args:
  GITHUB_REPO: https://github.com/YOUR_USERNAME/n8n-nodes-confluence-v2.git
  BRANCH: v1.0.0  # or specific commit hash
```

### Add Health Check

```yaml
# docker-compose.yml
services:
  n8n:
    # ... other config
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:5678/healthz"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### Persist Data

The `n8n_data` volume persists:
- Workflows
- Credentials
- Execution history

To backup:
```bash
docker run --rm -v n8n_data:/data -v $(pwd):/backup alpine tar czf /backup/n8n-backup.tar.gz /data
```

---

## Quick Commands

```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# Rebuild and restart
docker-compose build --no-cache && docker-compose up -d

# View logs
docker-compose logs -f

# Access container shell
docker exec -it n8n-with-confluence sh

# Remove everything (including data)
docker-compose down -v
```

---

## Next Steps

1. Upload code to GitHub
2. Update `YOUR_USERNAME` in Dockerfile and docker-compose.yml
3. Run `docker-compose up -d`
4. Test the node in n8n
5. Make updates and rebuild as needed
