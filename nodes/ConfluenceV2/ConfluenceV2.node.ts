import { IExecuteFunctions } from 'n8n-core';
import {
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import {
	getPagesBySpace,
	buildPageHierarchy,
	getRootPages,
	ConfluencePageV2,
} from './ConfluenceV2.helpers';

export class ConfluenceV2 implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Confluence V2',
		name: 'confluenceV2',
		icon: 'file:confluence.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Interact with Confluence using API v2',
		defaults: {
			name: 'Confluence V2',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'confluenceV2Api',
				required: true,
			},
		],
		properties: [
			// Operation
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Get Pages in Space',
						value: 'getPages',
						description: 'Get all pages in a space (flat list)',
						action: 'Get pages in space',
					},
					{
						name: 'Get Page Hierarchy',
						value: 'getHierarchy',
						description: 'Get pages with their folder structure (hierarchical)',
						action: 'Get page hierarchy',
					},
				],
				default: 'getHierarchy',
			},
			// Space ID
			{
				displayName: 'Space ID',
				name: 'spaceId',
				type: 'string',
				default: '',
				placeholder: 'e.g., 123456789',
				description: 'The ID of the Confluence space',
				required: true,
			},
			// Include Hierarchy (for getPages operation)
			{
				displayName: 'Include Hierarchy',
				name: 'includeHierarchy',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						operation: ['getPages'],
					},
				},
				description: 'Whether to fetch children for each page',
			},
			// Depth Control
			{
				displayName: 'Depth Control',
				name: 'depthControl',
				type: 'options',
				options: [
					{
						name: 'Full Depth',
						value: 'full',
						description: 'Fetch all levels (no limit)',
					},
					{
						name: 'Max Depth',
						value: 'limited',
						description: 'Limit the depth of hierarchy',
					},
				],
				default: 'full',
				displayOptions: {
					show: {
						operation: ['getHierarchy'],
					},
				},
				description: 'Control how deep to fetch the page hierarchy',
			},
			{
				displayName: 'Depth Control',
				name: 'depthControlPages',
				type: 'options',
				options: [
					{
						name: 'Full Depth',
						value: 'full',
						description: 'Fetch all levels (no limit)',
					},
					{
						name: 'Max Depth',
						value: 'limited',
						description: 'Limit the depth of hierarchy',
					},
				],
				default: 'full',
				displayOptions: {
					show: {
						operation: ['getPages'],
						includeHierarchy: [true],
					},
				},
				description: 'Control how deep to fetch the page hierarchy',
			},
			// Max Depth Number
			{
				displayName: 'Max Depth',
				name: 'maxDepth',
				type: 'number',
				default: 3,
				typeOptions: {
					minValue: 1,
					maxValue: 10,
				},
				displayOptions: {
					show: {
						operation: ['getHierarchy'],
						depthControl: ['limited'],
					},
				},
				description: 'Maximum depth to fetch (1 = only direct children)',
			},
			{
				displayName: 'Max Depth',
				name: 'maxDepthPages',
				type: 'number',
				default: 3,
				typeOptions: {
					minValue: 1,
					maxValue: 10,
				},
				displayOptions: {
					show: {
						operation: ['getPages'],
						includeHierarchy: [true],
						depthControlPages: ['limited'],
					},
				},
				description: 'Maximum depth to fetch (1 = only direct children)',
			},
			// Limit
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 250,
				typeOptions: {
					minValue: 1,
					maxValue: 250,
				},
				description: 'Maximum number of pages to return per request',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;
				const spaceId = this.getNodeParameter('spaceId', i) as string;
				const limit = this.getNodeParameter('limit', i) as number;

				if (operation === 'getPages') {
					// Get all pages (flat or with hierarchy)
					const includeHierarchy = this.getNodeParameter('includeHierarchy', i) as boolean;
					const response = await getPagesBySpace.call(this, spaceId, limit);

					if (includeHierarchy) {
						const depthControl = this.getNodeParameter('depthControlPages', i) as string;
						const maxDepth = depthControl === 'full' ? -1 : this.getNodeParameter('maxDepthPages', i) as number;

						// Build hierarchy for each page
						const pagesWithHierarchy = await Promise.all(
							response.results.map((page: ConfluencePageV2) =>
								buildPageHierarchy.call(this, page, 0, maxDepth)
							)
						);

						pagesWithHierarchy.forEach((page) => {
							returnData.push({ 
								json: page,
								pairedItem: i
							});
						});
					} else {
						// Return flat list
						response.results.forEach((page: ConfluencePageV2) => {
							returnData.push({ 
								json: page,
								pairedItem: i
							});
						});
					}
				} else if (operation === 'getHierarchy') {
					// Get page hierarchy (only root pages with children)
					const depthControl = this.getNodeParameter('depthControl', i) as string;
					const maxDepth = depthControl === 'full' ? -1 : this.getNodeParameter('maxDepth', i) as number;

					const response = await getPagesBySpace.call(this, spaceId, limit);
					const rootPages = getRootPages(response.results);

					// Build hierarchy for root pages only
					const hierarchy = await Promise.all(
						rootPages.map((page: ConfluencePageV2) =>
							buildPageHierarchy.call(this, page, 0, maxDepth)
						)
					);

					hierarchy.forEach((page) => {
						returnData.push({ 
							json: page,
							pairedItem: i
						});
					});
				}
			} catch (error: any) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
						},
						pairedItem: i,
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
