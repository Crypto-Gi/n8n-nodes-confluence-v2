# Usage Guide - n8n Confluence V2 Node

## Quick Start

### 1. Set Up Credentials

1. Go to n8n **Credentials** → **New**
2. Search for "Confluence API V2"
3. Fill in:
   - **Base URL**: `https://your-domain.atlassian.net/wiki`
   - **Email**: Your Atlassian email
   - **API Token**: [Generate here](https://id.atlassian.com/manage-profile/security/api-tokens)

### 2. Add Node to Workflow

1. Add "Confluence V2" node to your workflow
2. Select your credentials
3. Choose an operation

---

## Operations

### Operation 1: Get Pages in Space

**Purpose**: Fetch all pages from a space (flat list or with hierarchy)

**Parameters**:
- **Space ID**: The Confluence space ID (e.g., `354058617`)
- **Include Hierarchy**: Toggle to fetch children
- **Depth Control**: Choose "Full Depth" or "Max Depth"
- **Max Depth**: If limited, specify depth (1-10)
- **Limit**: Pages per request (max 250)

**Example Output (Flat)**:
```json
[
  {
    "id": "123456",
    "title": "My Page",
    "type": "page",
    "parentId": "789",
    "spaceId": "SPACE123"
  }
]
```

**Example Output (With Hierarchy)**:
```json
[
  {
    "id": "123456",
    "title": "Parent Page",
    "type": "page",
    "depth": 0,
    "children": [
      {
        "id": "789",
        "title": "Child Page",
        "depth": 1,
        "children": []
      }
    ]
  }
]
```

---

### Operation 2: Get Page Hierarchy

**Purpose**: Fetch only root pages with their complete folder structure

**Parameters**:
- **Space ID**: The Confluence space ID
- **Depth Control**: Choose "Full Depth" or "Max Depth"
- **Max Depth**: If limited, specify depth (1-10)
- **Limit**: Pages per request (max 250)

**What's the difference?**
- **Get Pages**: Returns ALL pages (optionally with children)
- **Get Hierarchy**: Returns only ROOT pages with children (cleaner tree structure)

**Example Output**:
```json
[
  {
    "id": "123456",
    "title": "Root Page 1",
    "type": "page",
    "depth": 0,
    "children": [...]
  },
  {
    "id": "789",
    "title": "Root Page 2",
    "type": "folder",
    "depth": 0,
    "children": [...]
  }
]
```

---

## Common Use Cases

### 1. Copy Confluence Space with Structure

```
Workflow:
1. Confluence V2 → Get Page Hierarchy (Source Space)
2. Loop through results
3. Confluence V2 → Create Page (Destination Space)
```

### 2. Build RAG System

```
Workflow:
1. Confluence V2 → Get Page Hierarchy
2. Extract text content
3. Pinecone/Weaviate → Upsert vectors with hierarchy metadata
```

### 3. Generate Documentation Map

```
Workflow:
1. Confluence V2 → Get Page Hierarchy
2. Function → Transform to markdown tree
3. Google Docs/Notion → Create documentation index
```

---

## Tips & Best Practices

### Finding Your Space ID

**Method 1: From URL**
- Go to your Confluence space
- URL format: `https://your-domain.atlassian.net/wiki/spaces/SPACEKEY/...`
- Space ID is in the page data (not the SPACEKEY)

**Method 2: Use API**
```bash
curl -u email@example.com:API_TOKEN \
  https://your-domain.atlassian.net/wiki/api/v2/spaces
```

### Depth Control

- **Full Depth**: Fetches all levels (can be slow for large spaces)
- **Max Depth = 1**: Only direct children
- **Max Depth = 3**: Recommended for most use cases
- **Max Depth = 5+**: Use for deep hierarchies

### Performance

- **Limit**: Default 250 is optimal
- **Hierarchy**: Each level adds API calls (depth 3 = potentially 250³ calls)
- **Rate Limiting**: Confluence has rate limits - add delays for large spaces

### Error Handling

Enable "Continue On Fail" in node settings to handle:
- Missing permissions
- Deleted pages
- API rate limits

---

## Troubleshooting

### "Confluence API Error: 401"
- Check your API token is valid
- Verify email is correct
- Regenerate API token if needed

### "Confluence API Error: 403"
- You don't have permission to access the space
- Ask space admin for access

### "Confluence API Error: 404"
- Space ID is incorrect
- Space may have been deleted

### Empty Results
- Space has no pages
- Pages are in draft status (only "current" pages are returned)
- Check space ID is correct

### Slow Performance
- Reduce Max Depth
- Reduce Limit
- Use "Get Pages" without hierarchy for flat lists

---

## API Endpoints Used

This node uses Confluence REST API v2:

- `GET /api/v2/spaces/{id}/pages` - Get all pages in space
- `GET /api/v2/pages/{id}/children` - Get page children
- `GET /api/v2/pages/{id}` - Get single page

**API Documentation**: https://developer.atlassian.com/cloud/confluence/rest/v2/

---

## Next Steps

1. **Test the node** with your Confluence instance
2. **Report issues** if you encounter any problems
3. **Share feedback** on what features you'd like to see

Happy automating! 🚀
