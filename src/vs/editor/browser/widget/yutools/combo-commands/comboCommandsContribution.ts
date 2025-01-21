/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// C:\ai\aide\src\vs\editor\common\editorCommon.ts
import { IEditorContribution } from '../../../../common/editorCommon.js';
import { ICodeEditor } from '../../../editorBrowser.js';
import { ComboWebsitesWidget } from './comboCommandsWidget.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';


export class ComboWebsitesContribution implements IEditorContribution {
	public static readonly ID = 'editor.contrib.comboWebsites';
	private widget: ComboWebsitesWidget | null = null;

	constructor(
		private readonly editor: ICodeEditor,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) { }

	public static get(editor: ICodeEditor): ComboWebsitesContribution {
		return editor.getContribution<ComboWebsitesContribution>(ComboWebsitesContribution.ID)!;
	}

	public show(): void {
		if (this.widget) {
			this.widget.dispose();
		}

		this.widget = this.instantiationService.createInstance(ComboWebsitesWidget, this.editor);
		this.widget.show();
	}

	public hide(): void {
		if (this.widget) {
			this.widget.hide();
		}
	}

	public toggle(): void {
		if (this.widget) {
			// this.widget.toggle();
			this.widget.kill();
			this.widget = null;
		} else {
			// this.show();
			this.widget = this.instantiationService.createInstance(ComboWebsitesWidget, this.editor);
			this.widget.show();
		}
	}

	public dispose(): void {
		if (this.widget) {
			this.widget.dispose();
			this.widget = null;
		}
	}
}
