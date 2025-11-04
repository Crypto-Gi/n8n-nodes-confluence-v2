# Enhancement Plan for Confluence V2 Node

## Current Status
- ✅ Published to npm as `n8n-nodes-confluence-v2` v0.1.1
- ⚠️ Icon not showing (needs fix)
- ⚠️ Missing operations compared to Bitovi node

## Issues to Fix

### 1. Icon Issue
**Problem**: SVG icon not showing in n8n UI
**Solution**: Copy SVG to dist directory during build
**Status**: ✅ Fixed in package.json

### 2. Missing Operations

#### Current Operations:
1. Get Pages in Space (basic)
2. Get Page Hierarchy (with depth control)

#### Bitovi Node Operations:
1. **Get Spaces** - List all Confluence spaces ❌ MISSING
2. Get Pages in Space (with extensive filtering) ⚠️ NEEDS ENHANCEMENT
3. Custom API call ❌ MISSING

## Enhancements Needed

### A. Add "Get Spaces" Operation

**API Endpoint**: `GET /wiki/api/v2/spaces`

**Parameters**:
- Space Keys (optional): Filter by comma-separated space keys
- Limit: Number of results (default: 50)
- Return All: Toggle to get all results

**Implementation**:
```typescript
// In helpers.ts
export async function getSpaces(
  this: IExecuteFunctions,
  spaceKeys?: string,
  limit?: number
): Promise<any> {
  const credentials = await this.getCredentials('confluenceV2Api');
  let url = `${credentials.baseUrl}/api/v2/spaces`;
  
  const qs: any = {};
  if (limit) qs.limit = limit;
  if (spaceKeys) qs.keys = spaceKeys;
  
  return await apiRequest.call(this, 'GET', url, {}, qs);
}
```

### B. Enhance "Get Pages in Space" Operation

**New Parameters**:
1. **Title** (string): Filter by exact title match
2. **Status** (options): current, archived, deleted, trashed
3. **Body Format** (options): storage, atlas_doc_format
4. **Sort** (options): 
   - modified-date (default)
   - created-date
   - title
   - id
5. **Sort Order** (options): asc, desc
6. **Return All** (boolean): Get all results vs limited
7. **Limit** (number): Max results when not returning all

**API Query Parameters**:
```
?title=exact-title
&status=current
&body-format=storage
&sort=modified-date
&limit=50
```

### C. Add Pagination Support

**Implementation**:
- Check for `_links.next` in response
- Loop until all pages fetched when "Return All" is true
- Respect limit when "Return All" is false

## Implementation Steps

### Step 1: Update Helpers (ConfluenceV2.helpers.ts)
1. Add `getSpaces()` function
2. Enhance `getPagesBySpace()` with new parameters
3. Add pagination helper function

### Step 2: Update Node (ConfluenceV2.node.ts)
1. Add "Get Spaces" to operations
2. Add new parameters for Get Spaces
3. Add enhanced parameters for Get Pages
4. Update execute() method to handle new operations

### Step 3: Update package.json
1. Bump version to 0.1.2
2. Update description with new features

### Step 4: Test & Publish
1. Build: `npm run build`
2. Test icon appears in dist
3. Publish: `npm publish --access public`
4. Test in n8n

## Expected Result

### Operations:
1. ✅ Get Spaces (NEW)
   - List all spaces
   - Filter by space keys
   - Pagination support

2. ✅ Get Pages in Space (ENHANCED)
   - Title filtering
   - Status filtering (current/archived/deleted/trashed)
   - Body format options
   - Sorting options
   - Pagination support
   - Optional hierarchy

3. ✅ Get Page Hierarchy (EXISTING)
   - Recursive hierarchy
   - Depth control
   - Root pages only

### Icon:
✅ Blue Confluence checkmark icon visible in n8n

## Timeline
- Icon fix: ✅ Done
- Get Spaces: 30 minutes
- Enhance Get Pages: 45 minutes
- Testing: 15 minutes
- **Total**: ~90 minutes

## Version History
- v0.1.0: Initial release (Get Pages, Get Hierarchy)
- v0.1.1: Added icon to package
- v0.1.2: Add Get Spaces, enhance Get Pages with filtering/sorting/pagination
