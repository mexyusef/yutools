/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { IRequestService } from '../../request/common/request.js';
import { IRequestOptions } from '../../../base/parts/request/common/request.js';
import { INotificationService } from '../../notification/common/notification.js';
import {
	// CancellationToken,
	CancellationTokenSource,
} from '../../../base/common/cancellation.js';
import {
	VSBuffer,
	// VSBufferReadableStream,
} from '../../../base/common/buffer.js';

export class ApiRequestHandler {
	constructor(
		private readonly requestService: IRequestService,
		private readonly notificationService: INotificationService
	) { }

	async sendRequest(apiUrl: string, requestData: any, apiKey?: string): Promise<void> {
		const headers: { [key: string]: string } = {
			'Content-Type': 'application/json',
		};
		if (apiKey) {
			headers['Authorization'] = `Bearer ${apiKey}`;
		}
		const options: IRequestOptions = {
			type: 'POST',
			url: apiUrl,
			data: JSON.stringify(requestData),
			headers,
		};
		const tokenSource = new CancellationTokenSource();
		try {
			const response = await this.requestService.request(options, tokenSource.token);

			const chunks: string[] = [];
			await new Promise<void>((resolve, reject) => {
				response.stream.on('data', (chunk: VSBuffer) => {
					chunks.push(chunk.toString());
				});
				response.stream.on('error', reject);
				response.stream.on('end', resolve);
			});

			const responseText = chunks.join('');
			console.log('Raw Response:', responseText);

			let responseBody;
			try {
				responseBody = JSON.parse(responseText);
			} catch (error) {
				console.error('Failed to parse response as JSON:', error);
				this.notificationService.error(`Failed to parse response: ${error.message}`);
				return;
			}

			if (responseBody.choices && responseBody.choices.length > 0) {
				const content = responseBody.choices[0].message.content;
				console.log('Content from API:', content);
				// this.notificationService.info(content);
				return content;
			} else {
				console.log('No valid message in the response from API');
				this.notificationService.error('No valid message in the response from API');
				return responseBody;
			}
		} catch (error) {
			this.notificationService.error(
				`Error sending request: ${error.message}. Sent options: ${JSON.stringify(options)}`
			);
		} finally {
			tokenSource.dispose();
		}
	}
}
