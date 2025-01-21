import * as vscode from 'vscode';
import axios from 'axios';
import cheerio from 'cheerio';
import { PostItem } from '../types';
import { getPromptAndContext, insertTextInEditor } from '../../../handlers/commands/vendor';

export async function scrapeSearchResult(query: string): Promise<PostItem[]> {
	const url = `https://community.flutterflow.io/search?query=${encodeURIComponent(query)}`;
	const response = await axios.get(url);
	const $ = cheerio.load(response.data);

	const postItems: PostItem[] = [];
	$('li.post-item > a').each((index, element) => {
		const $element = $(element);
		const title = $element.find('.text-content').text().trim();
		const author = $element.find('.text-content-subdued .text-content').text().trim();
		const date = $element.find('.text-content-subdued time').text().trim();
		const url = $element.attr('href')!;

		postItems.push({ title, author, date, url });
	});

	return postItems;
}

export const searchFlutterflowForum = vscode.commands.registerCommand(`yutools.searchFlutterflowForum`, async () => {
	// vscode.commands.executeCommand('vscode.open', vscode.Uri.file(imgPath));
	const { prompt, context } = await getPromptAndContext();
	let result = await scrapeSearchResult(prompt as string);
	let string_result = JSON.stringify(result, null, 2);
	insertTextInEditor(string_result);
});
