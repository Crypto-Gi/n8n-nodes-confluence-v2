import { IExecuteFunctions } from 'n8n-core';
import { IHttpRequestOptions } from 'n8n-workflow';

export interface ConfluencePageV2 {
	id: string;
	title: string;
	type: 'page' | 'folder';
	parentId?: string;
	parentType?: string;
	spaceId: string;
	position?: number;
	status: string;
	createdAt: string;
	authorId: string;
	version?: {
		number: number;
		createdAt: string;
	};
	_links?: any;
	children?: ConfluencePageV2[];
	depth?: number;
	[key: string]: any; // Index signature for n8n compatibility
}

export interface ConfluenceChildrenResponse {
	results: ConfluencePageV2[];
	_links?: {
		next?: string;
	};
}

/**
 * Make an authenticated request to Confluence V2 API
 */
export async function apiRequest(
	this: IExecuteFunctions,
	method: 'GET' | 'POST' | 'PUT' | 'DELETE',
	endpoint: string,
	qs: any = {},
): Promise<any> {
	const credentials = await this.getCredentials('confluenceV2Api');
	
	const options: IHttpRequestOptions = {
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		method,
		qs,
		url: `${credentials.baseUrl}/api/v2${endpoint}`,
		json: true,
		auth: {
			username: credentials.email as string,
			password: credentials.apiToken as string,
		},
	};

	try {
		return await this.helpers.httpRequest(options);
	} catch (error: any) {
		throw new Error(`Confluence API Error: ${error.message}`);
	}
}

/**
 * Get all pages in a space
 */
export async function getPagesBySpace(
	this: IExecuteFunctions,
	spaceId: string,
	limit: number = 250,
): Promise<ConfluenceChildrenResponse> {
	const endpoint = `/spaces/${spaceId}/pages`;
	return await apiRequest.call(this, 'GET', endpoint, { limit });
}

/**
 * Get direct children of a page (pages and folders only)
 */
export async function getPageChildren(
	this: IExecuteFunctions,
	pageId: string,
	limit: number = 250,
): Promise<ConfluenceChildrenResponse> {
	const endpoint = `/pages/${pageId}/children`;
	const response = await apiRequest.call(this, 'GET', endpoint, { limit });
	
	// Filter to only include pages and folders
	if (response.results) {
		response.results = response.results.filter(
			(item: ConfluencePageV2) => item.type === 'page' || item.type === 'folder'
		);
	}
	
	return response;
}

/**
 * Get a single page by ID with optional children included
 */
export async function getPageById(
	this: IExecuteFunctions,
	pageId: string,
	includeChildren: boolean = false,
): Promise<ConfluencePageV2> {
	const endpoint = `/pages/${pageId}`;
	const qs: any = {};
	
	if (includeChildren) {
		qs['include-direct-children'] = 'true';
	}
	
	return await apiRequest.call(this, 'GET', endpoint, qs);
}

/**
 * Recursively build page hierarchy with depth control
 */
export async function buildPageHierarchy(
	this: IExecuteFunctions,
	page: ConfluencePageV2,
	currentDepth: number = 0,
	maxDepth: number = -1,
): Promise<ConfluencePageV2> {
	// Add depth information
	page.depth = currentDepth;
	
	// Check if we should continue recursing
	if (maxDepth !== -1 && currentDepth >= maxDepth) {
		return page;
	}
	
	try {
		const childrenResponse = await getPageChildren.call(this, page.id);
		
		if (childrenResponse.results && childrenResponse.results.length > 0) {
			// Recursively fetch children
			page.children = await Promise.all(
				childrenResponse.results.map((child) =>
					buildPageHierarchy.call(this, child, currentDepth + 1, maxDepth)
				)
			);
		} else {
			page.children = [];
		}
	} catch (error: any) {
		// If we can't fetch children, just set empty array
		page.children = [];
	}
	
	return page;
}

/**
 * Get all root pages (pages with no parent or parent is space)
 */
export function getRootPages(pages: ConfluencePageV2[]): ConfluencePageV2[] {
	return pages.filter(
		(page) => !page.parentId || page.parentType === 'space' || page.parentType === null
	);
}
