/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { createDecorator } from 'vs/platform/instantiation/common/instantiation';
import { DisposableStore } from 'vs/base/common/lifecycle';
import { CustomWidgetView, IWidgetOptions } from './customWidgetView';

export const ICustomWidgetService = createDecorator<ICustomWidgetService>('customWidgetService');

export interface ICustomWidgetService {
	createWidget(id: string, options: IWidgetOptions): Promise<void>;
	showWidget(id: string): Promise<void>;
	hideWidget(id: string): Promise<void>;
	disposeWidget(id: string): Promise<void>;
}

export class CustomWidgetService implements ICustomWidgetService {
	private readonly widgets = new Map<string, { view: CustomWidgetView; disposables: DisposableStore }>();

	async createWidget(id: string, options: IWidgetOptions): Promise<void> {
		if (this.widgets.has(id)) {
			console.warn(`Widget with ID "${id}" already exists.`);
			return;
		}

		const disposables = new DisposableStore();

		// Create and initialize the widget view
		const view = new CustomWidgetView(id, options);
		view.create();

		// Store widget details
		this.widgets.set(id, { view, disposables });

		console.log(`Created widget "${id}" with options:`, options);
	}

	async showWidget(id: string): Promise<void> {
		const widget = this.widgets.get(id);
		if (!widget) {
			console.warn(`Cannot show widget. Widget with ID "${id}" does not exist.`);
			return;
		}

		widget.view.show();
	}

	async hideWidget(id: string): Promise<void> {
		const widget = this.widgets.get(id);
		if (!widget) {
			console.warn(`Cannot hide widget. Widget with ID "${id}" does not exist.`);
			return;
		}

		widget.view.hide();
	}

	async disposeWidget(id: string): Promise<void> {
		const widget = this.widgets.get(id);
		if (!widget) {
			console.warn(`Cannot dispose widget. Widget with ID "${id}" does not exist.`);
			return;
		}

		widget.view.dispose();
		widget.disposables.dispose();
		this.widgets.delete(id);

		console.log(`Disposed widget "${id}".`);
	}
}
