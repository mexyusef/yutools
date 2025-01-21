/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { IEditorContribution } from '../../../../../editor/common/editorCommon.js';
import { ICodeEditor } from '../../../../../editor/browser/editorBrowser.js';
import { Yuwidget5Widget } from './Yuwidget5Widget.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
// import { ICommandService } from '../../../../../platform/commands/common/commands';

export class Yuwidget5Contribution implements IEditorContribution {
	public static readonly ID = 'editor.contrib.Yuwidget5Contribution';
	private widget: Yuwidget5Widget | null = null;

	constructor(
		private readonly editor: ICodeEditor,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		// @ICommandService private readonly commandService: ICommandService,
	) { }

	public static get(editor: ICodeEditor): Yuwidget5Contribution {
		return editor.getContribution<Yuwidget5Contribution>(Yuwidget5Contribution.ID)!;
	}

	public show(): void {
		if (this.widget) {
			this.widget.dispose();
		}

		this.widget = this.instantiationService.createInstance(Yuwidget5Widget, this.editor);
		// this.widget = this.instantiationService.createInstance(Yuwidget5Widget, this.editor, this.commandService);
		this.widget.show();
	}


	public hide(): void {
		if (this.widget) {
			this.widget.hide();
		}
	}

	public toggle(): void {
		if (this.widget) {
			// console.log(`


			// *** TOGGLE WIDGET SKRG ADA

			//`);
			this.widget.kill();
			this.widget = null;
		} else {
			this.widget = this.instantiationService.createInstance(Yuwidget5Widget, this.editor);
			// this.widget = this.instantiationService.createInstance(Yuwidget5Widget, this.editor, this.commandService);
			// console.log(`


			// 	*** WIDGET GAK ADA, SKRG BUAT+SHOW

			//`);
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
