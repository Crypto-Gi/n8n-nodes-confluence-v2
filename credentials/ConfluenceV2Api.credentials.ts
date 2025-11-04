import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class ConfluenceV2Api implements ICredentialType {
	name = 'confluenceV2Api';
	displayName = 'Confluence API V2';
	documentationUrl = 'https://developer.atlassian.com/cloud/confluence/rest/v2/intro/';
	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://your-domain.atlassian.net/wiki',
			placeholder: 'https://your-domain.atlassian.net/wiki',
			description: 'The base URL of your Confluence instance',
			required: true,
		},
		{
			displayName: 'Email',
			name: 'email',
			type: 'string',
			default: '',
			placeholder: 'user@example.com',
			description: 'Your Confluence email',
			required: true,
		},
		{
			displayName: 'API Token',
			name: 'apiToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Your Confluence API token',
			required: true,
		},
	];
}
