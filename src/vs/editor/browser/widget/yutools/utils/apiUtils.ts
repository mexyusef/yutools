/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export async function postToBackendAPI<T>(url: string, data: object): Promise<T> {
	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			throw new Error(`Server error: ${response.statusText}`);
		}

		const responseData: T = await response.json();
		console.log('Received from server:', responseData);
		return responseData;
	} catch (error: any) {
		console.error('Error with POST request:', error);
		throw new Error(`Error with POST request: ${error.message}`);
	}
}

// import { postToBackendAPI } from './fulled/apiUtils';

// export class MyCustomWidget {
//     private async queryBackend(inputText: string) {
//         try {
//             const responseData = await postToBackendAPI<{ response: string }>('http://localhost:8000/quickQuery', {
//                 prompt: inputText,
//             });

//             const textToInsert = responseData.response || '';
//             console.log(`Text to insert: ${textToInsert}`);
//             return textToInsert;
//         } catch (error: any) {
//             console.error('Error with backend query:', error);
//             return `Error: ${error.message}`;
//         }
//     }
// }

// export function updateComboboxOptions(options: string[]): void {
// 	if (this.comboboxElement) {
// 		// Clear existing options
// 		this.comboboxElement.innerHTML = '';
// 		// Add new options
// 		options.forEach(optionText => {
// 			const option = document.createElement('option');
// 			option.value = optionText;
// 			option.textContent = optionText;
// 			this.comboboxElement.appendChild(option);
// 		});
// 	}
// }

// // this.fetchComboboxOptions().then(() => this.createInput());
// export async function fetchComboboxOptions(): Promise<void> {
// 	try {
// 		const response = await fetch('http://localhost:8000/comboboxes/terminal-widget');
// 		if (!response.ok) {
// 			throw new Error(`HTTP error! status: ${response.status}`);
// 		}
// 		const options = await response.json();
// 		this.updateComboboxOptions(options);
// 	} catch (error) {
// 		console.error('Failed to fetch combobox options:', error);
// 		// Fallback to default options if fetch fails
// 		this.updateComboboxOptions([
// 			'Create a funny story about Ning Nong, the girl in rural China.',
// 			'Create a blog post about Large Language Model.',
// 			'Create a blog post about latest AI tools for code assistants.'
// 		]);
// 	}
// }
