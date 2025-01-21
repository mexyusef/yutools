/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type * as vscode from 'vscode';
import { Emitter } from '../../../base/common/event.js';
import { ExtHostModelSelectionShape, IMainContext, MainContext, MainThreadModelSelectionShape } from './extHost.protocol.js';

export class ExtHostModelSelection implements ExtHostModelSelectionShape {
	private readonly _onModelSelectionChange = new Emitter<vscode.ModelSelection>();
	readonly onModelSelectionChange = this._onModelSelectionChange.event;

	private readonly _proxy: MainThreadModelSelectionShape;

	constructor(
		mainContext: IMainContext,
	) {
		this._proxy = mainContext.getProxy(MainContext.MainThreadModelSelection);
	}

	async getConfiguration(): Promise<vscode.ModelSelection> {
		return this._proxy.$getConfiguration();
	}

	$acceptConfigurationChanged(data: vscode.ModelSelection): void {
		this._onModelSelectionChange.fire(data);
	}
}
