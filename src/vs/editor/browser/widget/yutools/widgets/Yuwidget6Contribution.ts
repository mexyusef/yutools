/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { IEditorContribution } from '../../../../../editor/common/editorCommon.js';
import { ICodeEditor } from '../../../../../editor/browser/editorBrowser.js';
import { Yuwidget6Widget } from './Yuwidget6Widget.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';


export class Yuwidget6Contribution implements IEditorContribution {
	public static readonly ID = 'editor.contrib.Yuwidget6Contribution';
	private widget: Yuwidget6Widget | null = null;

	constructor(
		private readonly editor: ICodeEditor,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) { }

	public static get(editor: ICodeEditor): Yuwidget6Contribution {
		return editor.getContribution<Yuwidget6Contribution>(Yuwidget6Contribution.ID)!;
	}

	public show(): void {
		if (this.widget) {
			this.widget.dispose();
		}

		this.widget = this.instantiationService.createInstance(Yuwidget6Widget, this.editor);
		this.widget.show();
		this.widget.focusInput();
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
			this.show(); // kita sudah kill, jadi bisa bersih dari awal
			// this.widget = this.instantiationService.createInstance(Yuwidget6Widget, this.editor);
			// this.widget.show();
		}
	}

	public dispose(): void {
		if (this.widget) {
			this.widget.dispose();
			this.widget = null;
		}
	}
}
