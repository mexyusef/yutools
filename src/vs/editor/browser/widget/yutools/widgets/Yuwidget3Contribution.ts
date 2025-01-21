/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { IEditorContribution } from '../../../../../editor/common/editorCommon.js';
import { ICodeEditor } from '../../../../../editor/browser/editorBrowser.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { Yuwidget3Widget } from './Yuwidget3Widget.js';


export class Yuwidget3Contribution implements IEditorContribution {
	public static readonly ID = 'editor.contrib.Yuwidget3Contribution';
	private widget: Yuwidget3Widget | null = null;

	constructor(
		private readonly editor: ICodeEditor,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) { }

	public static get(editor: ICodeEditor): Yuwidget3Contribution {
		return editor.getContribution<Yuwidget3Contribution>(Yuwidget3Contribution.ID)!;
	}

	public show(): void {
		if (this.widget) {
			this.widget.dispose();
		}

		this.widget = this.instantiationService.createInstance(Yuwidget3Widget, this.editor);
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
			this.widget = this.instantiationService.createInstance(Yuwidget3Widget, this.editor);
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
