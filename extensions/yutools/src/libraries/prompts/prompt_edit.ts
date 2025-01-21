import { commands, ViewColumn, window } from 'vscode';
import { getAllPrompts, getPrompt, savePrompt } from './redisUtils';
import { Prompt } from './types';

export const editPromptCommand = commands.registerCommand('prompt.edit', async () => {
	const prompts = await getAllPrompts();
	const selectedPrompt = await window.showQuickPick(
		prompts.map((p) => ({
			label: p.title,
			description: p.tags.join(', '),
			detail: p.id, // Store the promptId in the detail field
		})),
		{ placeHolder: 'Select a prompt to edit' }
	);

	console.log(`selectedPrompt = ${JSON.stringify(selectedPrompt)}`);
	if (!selectedPrompt) return;

	const promptId = selectedPrompt.detail; // Access the promptId directly
	if (!promptId) return;

	console.log(`promptId = ${promptId}`);

	const prompt = await getPrompt(promptId);
	if (!prompt) {
		window.showErrorMessage('Prompt not found.');
		return;
	}

	openEditWebview(prompt);
});

function openEditWebview(prompt: Prompt) {
	const editWebviewPanel = window.createWebviewPanel(
		'promptEdit',
		`Edit Prompt: ${prompt.title}`,
		ViewColumn.One,
		{
			enableScripts: true,
			retainContextWhenHidden: true,
		}
	);

	editWebviewPanel.webview.html = getEditWebviewContent(prompt);

	editWebviewPanel.webview.onDidReceiveMessage(async (message) => {
		switch (message.command) {
			case 'save':
				const updatedPrompt: Prompt = {
					...prompt,
					title: message.title,
					content: message.content,
					tags: message.tags.split(',').map((tag: string) => tag.trim()),
					updatedAt: new Date().toISOString(),
				};

				await savePrompt(updatedPrompt);
				window.showInformationMessage(`Prompt "${updatedPrompt.title}" updated!`);
				editWebviewPanel.dispose();
				break;
		}
	});
}

function getEditWebviewContent(prompt: Prompt): string {
	return `
<!DOCTYPE html>
<html lang="en">
<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Edit Prompt</title>
		<style>
				body {
						font-family: Arial, sans-serif;
						padding: 20px;
				}
				label {
						display: block;
						margin-top: 10px;
				}
				input, textarea {
						width: 100%;
						margin-top: 5px;
						font-family: Arial, sans-serif;
				}
				textarea {
						height: 150px;
				}
				button {
						margin-top: 20px;
						padding: 10px 20px;
						background-color: #007acc;
						color: white;
						border: none;
						cursor: pointer;
				}
				button:hover {
						background-color: #005f99;
				}
		</style>
</head>
<body>
		<h1>Edit Prompt</h1>
		<label for="title">Title:</label>
		<input type="text" id="title" value="${prompt.title}" />

		<label for="content">Content:</label>
		<textarea id="content">${prompt.content}</textarea>

		<label for="tags">Tags (comma-separated):</label>
		<input type="text" id="tags" value="${prompt.tags.join(', ')}" />

		<button onclick="save()">Save</button>

		<script>
				const vscode = acquireVsCodeApi();
				function save() {
						const title = document.getElementById('title').value;
						const content = document.getElementById('content').value;
						const tags = document.getElementById('tags').value;

						vscode.postMessage({
								command: 'save',
								title,
								content,
								tags,
						});
				}
		</script>
</body>
</html>
	`;
}
