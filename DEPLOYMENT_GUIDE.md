# Deployment Guide - Add Confluence Node to Existing n8n

This guide shows how to add the Confluence V2 node to your existing n8n + PostgreSQL setup.

---

## 📋 What You Have

- Existing n8n running with PostgreSQL
- Behind Caddy reverse proxy (HTTPS)
- Custom environment configuration
- Data in `./n8n_storage` and `./db_storage`

## 🎯 What We're Adding

- Custom Confluence V2 node from GitHub
- Built into your n8n image
- Zero configuration changes to your existing setup

---

## 🚀 Deployment Steps

### Step 1: Copy Files to Your Server

Copy these files to your n8n directory on your server:

```bash
# From your Mac, copy to server
scp Dockerfile.production your-server:/path/to/your/n8n/directory/
scp docker-compose.production.yml your-server:/path/to/your/n8n/directory/
```

### Step 2: On Your Server

```bash
# SSH to your server
ssh your-server

# Navigate to your n8n directory
cd /path/to/your/n8n/directory

# Backup your current docker-compose.yml (just in case)
cp docker-compose.yml docker-compose.yml.backup

# Replace with the new one
mv docker-compose.production.yml docker-compose.yml
mv Dockerfile.production Dockerfile

# Stop current n8n (data is preserved in volumes)
docker-compose down

# Build the new image with Confluence node
docker-compose build

# Start everything
docker-compose up -d

# Check logs
docker-compose logs -f n8n
```

### Step 3: Verify

1. **Check if node is loaded**:
   ```bash
   docker-compose logs n8n | grep -i confluence
   ```
   
   You should see: `Loaded custom node: n8n-nodes-confluence-v2`

2. **Access n8n**: https://n8n.mynetwork.ing

3. **Find the node**:
   - Create new workflow
   - Search for "Confluence V2"
   - Should appear in node list

---

## 🔄 Update Workflow

When you update the Confluence node code:

### On Your Mac:
```bash
cd /Users/abdul-macmini/Desktop/Code\ Repo/n8n-node-confluence
# Make changes
git add .
git commit -m "Update: description"
git push origin main
```

### On Your Server:
```bash
cd /path/to/your/n8n/directory

# Rebuild with latest code from GitHub
docker-compose build --no-cache

# Restart
docker-compose up -d
```

---

## 📁 File Structure on Server

Your server directory should look like:

```
/path/to/your/n8n/directory/
├── docker-compose.yml          # Updated with build config
├── Dockerfile                  # Builds n8n with Confluence node
├── .env                        # Your existing env vars
├── init-data.sh                # Your postgres init script
├── db_storage/                 # PostgreSQL data (preserved)
└── n8n_storage/                # n8n data (preserved)
```

---

## ⚙️ What Changed

### In docker-compose.yml:

**Before:**
```yaml
n8n:
  image: docker.n8n.io/n8nio/n8n
  # ... rest of config
```

**After:**
```yaml
n8n:
  build:
    context: .
    dockerfile: Dockerfile
  environment:
    # ... all your existing vars
    - N8N_COMMUNITY_PACKAGES_ENABLED=true  # ⭐ Added this
  # ... rest of config (unchanged)
```

### What's Preserved:

✅ All environment variables  
✅ PostgreSQL configuration  
✅ Volumes (your data)  
✅ Ports  
✅ Network settings  
✅ Caddy reverse proxy config  
✅ HTTPS settings  

### What's Added:

⭐ Confluence V2 node  
⭐ Community packages enabled  
⭐ Automatic updates from GitHub  

---

## 🐛 Troubleshooting

### Node doesn't appear

1. **Check if community packages are enabled**:
   ```bash
   docker-compose exec n8n env | grep N8N_COMMUNITY
   ```
   Should show: `N8N_COMMUNITY_PACKAGES_ENABLED=true`

2. **Check if node is installed**:
   ```bash
   docker-compose exec n8n ls -la /home/node/.n8n/node_modules | grep confluence
   ```

3. **Check build logs**:
   ```bash
   docker-compose build --no-cache 2>&1 | tee build.log
   ```

### Build fails

1. **Check internet connection** (needs to clone from GitHub)
2. **Verify GitHub repo is public**: https://github.com/Crypto-Gi/n8n-nodes-confluence-v2
3. **Check Docker has enough space**:
   ```bash
   docker system df
   ```

### n8n won't start

1. **Check logs**:
   ```bash
   docker-compose logs n8n
   ```

2. **Verify PostgreSQL is healthy**:
   ```bash
   docker-compose ps
   ```

3. **Rollback if needed**:
   ```bash
   docker-compose down
   cp docker-compose.yml.backup docker-compose.yml
   docker-compose up -d
   ```

---

## 🔒 Security Notes

- ✅ Dockerfile uses official n8n image as base
- ✅ Switches back to `node` user (not root)
- ✅ Only installs git (minimal dependencies)
- ✅ Clones from your public GitHub repo
- ✅ All existing security settings preserved

---

## 📊 Build Time

Expected build time: **2-5 minutes**

Steps:
1. Pull base n8n image (if not cached)
2. Install git (~10 seconds)
3. Clone repo from GitHub (~5 seconds)
4. npm install (~1-2 minutes)
5. npm build (~30 seconds)
6. Link node (~1 second)

---

## ✅ Verification Checklist

After deployment:

- [ ] n8n starts successfully
- [ ] PostgreSQL connection works
- [ ] Can access https://n8n.mynetwork.ing
- [ ] Confluence V2 node appears in node list
- [ ] Can create credentials for Confluence
- [ ] Can add Confluence V2 node to workflow
- [ ] Existing workflows still work

---

## 🆘 Need Help?

If something goes wrong:

1. **Check logs**: `docker-compose logs -f`
2. **Verify files**: Make sure Dockerfile and docker-compose.yml are in the same directory
3. **Rebuild**: `docker-compose build --no-cache`
4. **Rollback**: Use your backup docker-compose.yml

---

## 📝 Quick Commands Reference

```bash
# Build
docker-compose build

# Start
docker-compose up -d

# Stop
docker-compose down

# Logs
docker-compose logs -f n8n

# Rebuild and restart
docker-compose down && docker-compose build --no-cache && docker-compose up -d

# Check node is installed
docker-compose exec n8n ls -la /home/node/.n8n/node_modules | grep confluence

# Access container shell
docker-compose exec n8n sh
```

---

**Ready to deploy!** 🚀

Copy the files to your server and follow the steps above.
