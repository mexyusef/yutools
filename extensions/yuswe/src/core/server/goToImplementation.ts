/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { SidecarGoToImplementationRequest, SidecarGoToImplementationResponse } from './types';
import { shouldTrackFile } from '../utilities/openTabs';

export async function goToImplementation(request: SidecarGoToImplementationRequest): Promise<SidecarGoToImplementationResponse> {
	const locations: (vscode.Location | vscode.LocationLink)[] | undefined = await vscode.commands.executeCommand(
		'vscode.executeImplementationProvider',
		vscode.Uri.file(request.fs_file_path),
		new vscode.Position(request.position.line, request.position.character),
	);
	if (!locations) {
		return { implementation_locations: [] };
	}

	const implementations = await Promise.all(locations.map(async (location) => {
		let uri: vscode.Uri;
		let range: vscode.Range;

		if ('targetUri' in location) {
			uri = location.targetUri;
			range = location.targetRange;
		} else {
			uri = location.uri;
			range = location.range;
		}

		if (shouldTrackFile(uri)) {
			// console.log('we are trakcing this uri');
			// console.log(uri);
		}

		return {
			fs_file_path: uri.fsPath,
			range: {
				startPosition: {
					line: range.start.line,
					character: range.start.character,
					byteOffset: 0,
				},
				endPosition: {
					line: range.end.line,
					character: range.end.character,
					byteOffset: 0,
				},
			}
		};
	}));
	return {
		implementation_locations: implementations,
	};
}
