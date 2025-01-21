import * as vscode from 'vscode';
import { insert_string_at_cursor } from '../utilities/insert_string_at_cursor';

export const insertQuickFMUS = vscode.commands.registerCommand(`yutools.insertQuickFMUS`, async () => {
	insert_string_at_cursor(["//1 ", "//2 ", "//3 ", "//l "]);
});
