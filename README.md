# n8n-nodes-confluence-v2

This is an n8n community node for working with Atlassian Confluence using the **V2 REST API**.

## Features

- ✅ **V2 API Support**: Uses the latest Confluence REST API v2
- ✅ **Hierarchy Support**: Fetch pages with their complete folder structure
- ✅ **Depth Control**: Configure how deep to fetch (full depth or limited)
- ✅ **Pages & Folders**: Supports both pages and folder content types
- ✅ **Flexible Operations**: Get flat lists or hierarchical structures

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

1. Make sure community nodes are enabled: `N8N_COMMUNITY_PACKAGES_ENABLED=true`
2. In n8n, go to **Settings** → **Community Nodes**
3. Install: `n8n-nodes-confluence-v2`

## Operations

### Get Pages in Space
Get all pages in a Confluence space as a flat list.

**Options:**
- **Include Hierarchy**: Optionally fetch children for each page
- **Depth Control**: Full depth or limited depth
- **Max Depth**: Limit how many levels deep to fetch (1-10)
- **Limit**: Number of pages per request (max 250)

### Get Page Hierarchy
Get pages organized in their folder structure (hierarchical tree).

**Options:**
- **Depth Control**: Full depth or limited depth
- **Max Depth**: Limit how many levels deep to fetch (1-10)
- **Limit**: Number of pages per request (max 250)

## Credentials

This node requires Confluence API credentials:

1. **Base URL**: Your Confluence instance URL
   - Format: `https://your-domain.atlassian.net/wiki`
2. **Email**: Your Atlassian account email
3. **API Token**: Generate from [Atlassian API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens)

## Output Structure

### Flat List (Get Pages)
```json
{
  "id": "123456",
  "title": "My Page",
  "type": "page",
  "parentId": "789",
  "parentType": "page",
  "spaceId": "SPACE",
  "status": "current",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "authorId": "user123"
}
```

### Hierarchical (Get Page Hierarchy)
```json
{
  "id": "123456",
  "title": "Parent Page",
  "type": "page",
  "spaceId": "SPACE",
  "depth": 0,
  "children": [
    {
      "id": "789",
      "title": "Child Page",
      "type": "page",
      "parentId": "123456",
      "depth": 1,
      "children": []
    }
  ]
}
```

## Use Cases

### 1. Migrate Confluence Content
Preserve folder structure when copying pages between spaces or instances.

### 2. Build RAG Systems
Extract hierarchical content for vector databases and AI applications.

### 3. Content Auditing
Analyze page structures and relationships.

### 4. Automated Documentation
Generate documentation maps from Confluence spaces.

## API Version

This node uses **Confluence REST API v2** endpoints:
- `/api/v2/spaces/{id}/pages`
- `/api/v2/pages/{id}/children`
- `/api/v2/pages/{id}`

## Compatibility

- n8n version: 0.125.0+
- Node version: 1.0.0
- Tested with: n8n Cloud and self-hosted instances

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run dev

# Lint
npm run lint
```

## License

[MIT](LICENSE.md)

## Support

For issues and feature requests, please visit the [GitHub repository](https://github.com/yourusername/n8n-nodes-confluence-v2).

## Changelog

### 0.1.0 (Initial Release)
- V2 API support
- Hierarchy fetching with depth control
- Pages and folders support
- Two operations: Get Pages and Get Page Hierarchy
