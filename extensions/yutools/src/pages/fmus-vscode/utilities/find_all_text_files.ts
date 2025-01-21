// import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { is_text_file } from './is_text_file';

export function find_all_text_files(dir: string): string[] {
	let results: string[] = [];
	const list = fs.readdirSync(dir);
	list.forEach(file => {
		file = path.resolve(dir, file);
		const stat = fs.lstatSync(file);
		if (stat && stat.isDirectory()) {
			results = results.concat(find_all_text_files(file));
		} else if (is_text_file(file)) {
			results.push(file);
		}
	});
	return results;
}
