/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
export interface IWidgetOptions {
	title: string;
	placeholder?: string; // Textarea placeholder text
	position?: 'left' | 'right' | 'top' | 'bottom'; // Widget placement
	[key: string]: any; // Future extensibility
}

export class CustomWidgetView {
	private container: HTMLElement | null = null;

	constructor(private readonly id: string, private readonly options: IWidgetOptions) { }

	create(): void {
		if (this.container) {
			console.warn(`Widget "${this.id}" is already created.`);
			return;
		}

		const container = document.createElement('div');
		container.className = `custom-widget-view`;
		container.style.position = 'absolute';
		container.style[`${this.options.position || 'right'}`] = '10px';
		container.style.bottom = '10px';
		container.style.width = '300px';
		container.style.background = '#ffffff';
		container.style.border = '1px solid #cccccc';
		container.style.padding = '10px';
		container.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
		container.style.zIndex = '1000';
		container.style.display = 'none'; // Initially hidden

		// Add title
		const titleElement = document.createElement('div');
		titleElement.textContent = this.options.title || 'Custom Widget';
		titleElement.style.fontWeight = 'bold';
		titleElement.style.marginBottom = '8px';
		container.appendChild(titleElement);

		// Add a textarea
		const textarea = document.createElement('textarea');
		textarea.placeholder = this.options.placeholder || 'Type here...';
		textarea.style.width = '100%';
		textarea.style.height = '100px';
		textarea.style.resize = 'none'; // Prevent resizing
		container.appendChild(textarea);

		// Append the container to the DOM
		document.body.appendChild(container);

		this.container = container;

		console.log(`Widget "${this.id}" created.`);
	}

	show(): void {
		if (!this.container) {
			console.warn(`Widget "${this.id}" is not created yet.`);
			return;
		}
		this.container.style.display = 'block';
		console.log(`Widget "${this.id}" shown.`);
	}

	hide(): void {
		if (!this.container) {
			console.warn(`Widget "${this.id}" is not created yet.`);
			return;
		}
		this.container.style.display = 'none';
		console.log(`Widget "${this.id}" hidden.`);
	}

	dispose(): void {
		if (this.container) {
			this.container.remove();
			this.container = null;
		}
		console.log(`Widget "${this.id}" disposed.`);
	}
}
