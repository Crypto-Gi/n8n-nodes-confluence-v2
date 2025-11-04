# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.2] - 2025-11-03

### Changed
- **Documentation Update**: Updated README on npm package page
  - Added Get Spaces operation documentation with examples
  - Removed Use Cases section
  - Updated API endpoints list to include `/api/v2/spaces`
  - Enhanced output examples for all operations
  - Updated changelog references

### Note
This is a documentation-only release to update the npm package page. No code changes.

## [0.2.1] - 2025-11-03

### Fixed
- **Duplicate Limit Parameter**: Fixed duplicate "Limit" parameter appearing on Get Spaces operation
  - Added `displayOptions` to second Limit parameter to restrict it to `getPages` and `getHierarchy` operations only
  - Get Spaces now shows only one Limit field (default: 50)
  - Get Pages and Get Hierarchy show their own Limit field (default: 250)

### Verified
- Icon display working correctly (resolved from v0.2.0)
- All three operations functioning properly
- Authentication working with real Confluence API
- No other bugs found in codebase

## [0.2.0] - 2025-11-03

### Added
- **Get Spaces Operation**: New operation to list all Confluence spaces
  - Optional space keys filtering (comma-separated)
  - Configurable limit parameter (default: 50)
  - Returns all space metadata including ID, key, name, type, status, etc.

### Changed
- Updated node description to include spaces listing functionality
- Improved parameter organization with better display options

### Tested
- Comprehensive testing with real Confluence API (https://mirasko.atlassian.net)
- Successfully retrieved 2 real Confluence spaces
- Authentication verified working correctly
- All data fields properly populated

## [0.1.2] - 2025-11-02

### Fixed
- **Icon Display**: Fixed icon not loading by copying SVG to dist during build
  - Added `copy:icons` script to package.json
  - Icon now displays correctly in n8n UI

## [0.1.1] - 2025-11-02

### Changed
- Include nodes directory with SVG icon in npm package
- Updated files array in package.json

## [0.1.0] - 2025-11-02

### Added
- Initial release with two operations:
  - **Get Pages in Space**: Retrieve all pages from a Confluence space
    - Flat list or hierarchical structure
    - Configurable depth control
    - Optional hierarchy fetching
  - **Get Page Hierarchy**: Get pages with folder structure
    - Root pages only
    - Recursive children fetching
    - Depth limiting options

### Features
- Confluence API v2 integration
- Email + API token authentication
- Hierarchical page structure support
- Depth control for hierarchy fetching
- Configurable result limits
- Error handling with continue on fail support

---

## Links
- [npm Package](https://www.npmjs.com/package/n8n-nodes-confluence-v2)
- [GitHub Repository](https://github.com/Crypto-Gi/n8n-nodes-confluence-v2)
- [Confluence API v2 Documentation](https://developer.atlassian.com/cloud/confluence/rest/v2/intro/)
