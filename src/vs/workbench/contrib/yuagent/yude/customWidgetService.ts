/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { DisposableStore } from 'vs/base/common/lifecycle';
import { CustomWidgetView, IWidgetOptions } from './customWidgetView';
import { createDecorator } from 'vs/platform/instantiation/common/instantiation';

export const ICustomWidgetService = createDecorator<ICustomWidgetService>('customWidgetService');

export interface ICustomWidgetService {
	createWidget(id: string, options: IWidgetOptions): void;
	showWidget(id: string): void;
	hideWidget(id: string): void;
	disposeWidget(id: string): void;
}

export class CustomWidgetService implements ICustomWidgetService {
	private readonly widgets = new Map<string, { view: CustomWidgetView; disposables: DisposableStore }>();

	constructor(
		// @IInstantiationService private readonly instantiationService: IInstantiationService,
	) { }

	createWidget(id: string, options: IWidgetOptions): void {
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

	showWidget(id: string): void {
		const widget = this.widgets.get(id);
		if (!widget) {
			console.warn(`Cannot show widget. Widget with ID "${id}" does not exist.`);
			return;
		}

		widget.view.show();
	}

	hideWidget(id: string): void {
		const widget = this.widgets.get(id);
		if (!widget) {
			console.warn(`Cannot hide widget. Widget with ID "${id}" does not exist.`);
			return;
		}

		widget.view.hide();
	}

	disposeWidget(id: string): void {
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
