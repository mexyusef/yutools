/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { IEditorContribution } from '../../../../../editor/common/editorCommon.js';
import { ICodeEditor } from '../../../../../editor/browser/editorBrowser.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { BrowserProfileWidget } from './BrowserProfileWidget.js';

export class BrowserProfileContribution implements IEditorContribution {
	public static readonly ID = 'editor.contrib.BrowserProfileContribution';
	private widget: BrowserProfileWidget | null = null;

	constructor(
		private readonly editor: ICodeEditor,
		@IInstantiationService private readonly instantiationService: IInstantiationService
	) { }

	public static get(editor: ICodeEditor): BrowserProfileContribution {
		return editor.getContribution<BrowserProfileContribution>(BrowserProfileContribution.ID)!;
	}

	public show(): void {
		if (this.widget) {
			this.widget.dispose();
		}

		// Create and show the widget
		this.widget = this.instantiationService.createInstance(BrowserProfileWidget, this.editor);
		this.widget.show();
	}

	public hide(): void {
		if (this.widget) {
			this.widget.hide();
		}
	}

	public toggle(): void {
		if (this.widget) {
			// If the widget exists, kill it
			this.widget.kill();
			this.widget = null;
		} else {
			this.show(); // kita sudah kill, jadi bisa bersih dari awal
		}
	}

	public dispose(): void {
		if (this.widget) {
			this.widget.dispose();
			this.widget = null;
		}
	}
}
