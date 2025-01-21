/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IEditorContribution } from '../../../../common/editorCommon.js';
import { ICodeEditor } from '../../../editorBrowser.js';
import { Yuwidget1Widget } from './Yuwidget1Widget.js';

export class Yuwidget1Contribution implements IEditorContribution {
	public static readonly ID = 'editor.contrib.Yuwidget1Contribution';
	private widget: Yuwidget1Widget | null = null;

	constructor(
		private readonly editor: ICodeEditor,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) { }

	public static get(editor: ICodeEditor): Yuwidget1Contribution {
		return editor.getContribution<Yuwidget1Contribution>(Yuwidget1Contribution.ID)!;
	}

	public show(): void {
		if (this.widget) {
			this.widget.dispose();
		}

		this.widget = this.instantiationService.createInstance(Yuwidget1Widget, this.editor);
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
			this.widget = this.instantiationService.createInstance(Yuwidget1Widget, this.editor);
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
