import { window, commands, ExtensionContext, workspace, Uri } from 'vscode';
import { v4 as uuidv4 } from 'uuid';
import { savePrompt, deletePrompt, getAllPrompts, getPrompt } from './redisUtils';
import { Prompt } from './types';
import { readdir, readFile } from 'fs/promises';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { viewPromptsCommandWebview } from './prompt_webview';
import { editPromptCommand } from './prompt_edit';
import { initializeRedisClient } from './redisClient';
import { viewPromptsCommandWebviewWithInsert } from './prompt_webview_insert';

const exportPromptsCommand = commands.registerCommand('prompt.export', async () => {
	const prompts = await getAllPrompts();
	const exportFormat = await window.showQuickPick(['JSON', 'TXT'], {
		placeHolder: 'Select export format',
	});

	if (!exportFormat) return;

	const fileUri = await window.showSaveDialog({
		filters: { [exportFormat]: [exportFormat.toLowerCase()] },
	});

	if (!fileUri) return;

	let fileContent: string;
	if (exportFormat === 'JSON') {
		fileContent = JSON.stringify(prompts, null, 2);
	} else {
		fileContent = prompts
			.map((p) => `${p.title}\n${p.content}\nTags: ${p.tags.join(', ')}\n`)
			.join('\n');
	}

	await writeFile(fileUri.fsPath, fileContent);
	window.showInformationMessage(`Prompts exported to ${fileUri.fsPath}!`);
});

// const insertPromptCommand = commands.registerCommand('prompt.insert', async () => {
// 	const prompts = await getAllPrompts();
// 	const selectedPrompt = await window.showQuickPick(
// 		prompts.map((p) => `${p.title} (${p.tags.join(', ')})`),
// 		{ placeHolder: 'Select a prompt to insert' }
// 	);

// 	if (!selectedPrompt) return;

// 	const promptId = selectedPrompt.split(' ').pop()?.slice(1, -1);
// 	if (!promptId) return;

// 	const prompt = await getPrompt(promptId);
// 	if (!prompt) {
// 		window.showErrorMessage('Prompt not found.');
// 		return;
// 	}

// 	const editor = window.activeTextEditor;
// 	if (!editor) {
// 		window.showErrorMessage('No active editor found.');
// 		return;
// 	}

// 	editor.edit((editBuilder) => {
// 		editBuilder.insert(editor.selection.active, prompt.content);
// 	});

// 	window.showInformationMessage(`Prompt "${prompt.title}" inserted!`);
// });
const insertPromptCommand = commands.registerCommand('prompt.insert', async () => {
	const prompts = await getAllPrompts();
	const selectedPrompt = await window.showQuickPick(
		prompts.map((p) => ({
			label: p.title,
			description: p.tags.join(', '),
			detail: p.id, // Store the promptId in the detail field
		})),
		{ placeHolder: 'Select a prompt to insert' }
	);

	if (!selectedPrompt) return;

	const promptId = selectedPrompt.detail; // Access the promptId directly
	if (!promptId) return;
	console.log(`promptId = ${promptId}`);
	const prompt = await getPrompt(promptId);
	if (!prompt) {
		window.showErrorMessage('Prompt not found.');
		return;
	}

	const editor = window.activeTextEditor;
	if (!editor) {
		window.showErrorMessage('No active editor found.');
		return;
	}

	editor.edit((editBuilder) => {
		editBuilder.insert(editor.selection.active, prompt.content);
	});

	window.showInformationMessage(`Prompt "${prompt.title}" inserted!`);
});

const searchPromptsCommand = commands.registerCommand('prompt.search', async () => {
	const searchQuery = await window.showInputBox({ prompt: 'Enter search query' });
	if (!searchQuery) return;

	const prompts = await getAllPrompts();
	const filteredPrompts = prompts.filter(
		(p) =>
			p.title.includes(searchQuery) ||
			p.content.includes(searchQuery) ||
			p.tags.some((tag) => tag.includes(searchQuery))
	);

	const promptList = filteredPrompts
		.map((p) => `${p.title} (${p.tags.join(', ')})`)
		.join('\n');

	window.showInformationMessage(`Search Results:\n${promptList}`);
});

const filterByTagsCommand = commands.registerCommand('prompt.filterByTags', async () => {
	const prompts = await getAllPrompts();
	const allTags = [...new Set(prompts.flatMap((p) => p.tags))];

	const selectedTags = await window.showQuickPick(allTags, {
		placeHolder: 'Select tags to filter by',
		canPickMany: true,
	});

	if (!selectedTags || selectedTags.length === 0) return;

	const filteredPrompts = prompts.filter((p) =>
		selectedTags.every((tag) => p.tags.includes(tag))
	);

	const promptList = filteredPrompts
		.map((p) => `${p.title} (${p.tags.join(', ')})`)
		.join('\n');

	window.showInformationMessage(`Filtered Prompts:\n${promptList}`);
});

const fromFolderCommand = commands.registerCommand('prompt.fromFolder', async () => {
	const folderUri = await window.showOpenDialog({
		canSelectFiles: false,
		canSelectFolders: true,
	});

	if (!folderUri || folderUri.length === 0) return;

	const folderPath = folderUri[0].fsPath;
	const files = await readdir(folderPath);

	const prompts: Prompt[] = [];
	for (const file of files) {
		if (file.endsWith('.txt')) {
			const filePath = join(folderPath, file);
			const fileContent = await readFile(filePath, 'utf-8');
			const title = file.replace('.txt', '');
			prompts.push({
				id: uuidv4(),
				title,
				content: fileContent,
				tags: [],
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			});
		}
	}

	for (const prompt of prompts) {
		await savePrompt(prompt);
	}

	window.showInformationMessage(`Imported ${prompts.length} prompt(s) from folder!`);
});

const fromFileCommand = commands.registerCommand('prompt.fromFile', async () => {
	const fileUri = await window.showOpenDialog({
		canSelectFiles: true,
		canSelectFolders: false,
		filters: { 'Text Files': ['txt', 'json'] },
	});

	if (!fileUri || fileUri.length === 0) return;

	const filePath = fileUri[0].fsPath;
	const fileContent = await readFile(filePath, 'utf-8');

	let prompts: Prompt[] = [];
	if (filePath.endsWith('.json')) {
		prompts = JSON.parse(fileContent);
	} else if (filePath.endsWith('.txt')) {
		const title = filePath.split('/').pop()?.replace('.txt', '') || 'Untitled';
		prompts = [{
			id: uuidv4(),
			title,
			content: fileContent,
			tags: [],
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		}];
	}

	for (const prompt of prompts) {
		await savePrompt(prompt);
	}

	window.showInformationMessage(`Imported ${prompts.length} prompt(s) from file!`);
});

const fromSelectionCommand = commands.registerCommand('prompt.fromSelection', async () => {
	const editor = window.activeTextEditor;
	if (!editor) {
		window.showErrorMessage('No active editor found.');
		return;
	}

	const selection = editor.document.getText(editor.selection);
	if (!selection) {
		window.showErrorMessage('No text selected.');
		return;
	}

	const title = await window.showInputBox({ prompt: 'Enter prompt title' });
	if (!title) return;

	const tagsInput = await window.showInputBox({ prompt: 'Enter tags (comma-separated)' });
	const tags = tagsInput ? tagsInput.split(',').map((tag) => tag.trim()) : [];

	const prompt: Prompt = {
		id: uuidv4(),
		title,
		content: selection,
		tags,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	};

	await savePrompt(prompt);
	window.showInformationMessage(`Prompt "${title}" created from selection!`);
});

const createPromptCommand = commands.registerCommand('prompt.create', async () => {
	const title = await window.showInputBox({ prompt: 'Enter prompt title' });
	if (!title) return;

	const content = await window.showInputBox({ prompt: 'Enter prompt content' });
	if (!content) return;

	const tagsInput = await window.showInputBox({ prompt: 'Enter tags (comma-separated)' });
	const tags = tagsInput ? tagsInput.split(',').map((tag) => tag.trim()) : [];

	const prompt: Prompt = {
		id: uuidv4(),
		title,
		content,
		tags,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	};

	await savePrompt(prompt);
	window.showInformationMessage(`Prompt "${title}" created!`);
});

const viewPromptsCommand = commands.registerCommand('prompt.view', async () => {
	const prompts = await getAllPrompts();
	const promptList = prompts.map((p) => `${p.title} (${p.tags.join(', ')})`).join('\n');
	window.showInformationMessage(`Prompts:\n${promptList}`);
});

const deletePromptCommand = commands.registerCommand('prompt.delete', async () => {
	const prompts = await getAllPrompts();
	const selectedPrompt = await window.showQuickPick(
		prompts.map((p) => `${p.title} (${p.id})`),
		{ placeHolder: 'Select a prompt to delete' }
	);

	if (!selectedPrompt) return;

	const promptId = selectedPrompt.split(' ').pop()?.slice(1, -1);
	if (!promptId) return;

	await deletePrompt(promptId);
	window.showInformationMessage(`Prompt deleted!`);
});

export async function register_redis_prompt_commands(context: ExtensionContext) {
	try {
		await initializeRedisClient();
		console.log('Redis client initialized');
	} catch (error) {
		console.error('Failed to initialize Redis client:', error);
		window.showErrorMessage('Failed to initialize Redis client. Check the logs for details.');
		return;
	}

	context.subscriptions.push(createPromptCommand);
	context.subscriptions.push(viewPromptsCommand);
	context.subscriptions.push(deletePromptCommand);
	context.subscriptions.push(fromSelectionCommand);
	context.subscriptions.push(fromFileCommand);
	context.subscriptions.push(fromFolderCommand);
	context.subscriptions.push(filterByTagsCommand);
	context.subscriptions.push(searchPromptsCommand);
	context.subscriptions.push(insertPromptCommand);
	context.subscriptions.push(exportPromptsCommand);
	context.subscriptions.push(viewPromptsCommandWebview);
	context.subscriptions.push(viewPromptsCommandWebviewWithInsert);
	context.subscriptions.push(editPromptCommand);
}
