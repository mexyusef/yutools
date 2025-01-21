import * as vscode from 'vscode';
import { getRedisClient } from './redisClient';

interface Tweet {
	id: string;
	content: string;
	name: string;
	date: string;
	title: string;
}

export function createWebviewTable(): void {
	const panel = vscode.window.createWebviewPanel(
		'tweetViewer',
		'Tweet Viewer',
		vscode.ViewColumn.One,
		{ enableScripts: true }
	);

	// Store the last active editor
	const lastActiveEditor = vscode.window.activeTextEditor;

	let currentPage = 1;

	async function updateWebview(page: number = 1): Promise<void> {
		const redisClient = await getRedisClient();
		const tweets = await redisClient.hGetAll('tweets');
		let tweetList: Tweet[] = Object.values(tweets).map(tweet => JSON.parse(tweet));

		// Sort tweets by date (newest first)
		tweetList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

		// Pagination logic
		const perPage = 15;
		const start = (page - 1) * perPage;
		const end = start + perPage;
		const paginatedTweets = tweetList.slice(start, end);

		panel.webview.html = getWebviewContent(paginatedTweets, page, Math.ceil(tweetList.length / perPage), lastActiveEditor);
	}

	// Initial render
	updateWebview(currentPage);

	// Handle messages from the webview (e.g., pagination, insert)

	panel.webview.onDidReceiveMessage(async (message: { command: string; page?: number; content?: string }) => {
		if (message.command === 'navigate' && message.page) {
			currentPage = message.page;
			await updateWebview(currentPage);
		} else if (message.command === 'insert' && lastActiveEditor) {
			// Use a default value if content is undefined
			// const content = message.content || '';
			// lastActiveEditor.edit(editBuilder => {
			// 	const position = lastActiveEditor.selection.active;
			// 	editBuilder.insert(position, content);
			// });
			if (message.content) {
				lastActiveEditor.edit(editBuilder => {
					const position = lastActiveEditor.selection.active;
					editBuilder.insert(position, message.content!); // Use non-null assertion here
				});
			} else {
				vscode.window.showErrorMessage('No content to insert.');
			}

		}
	});

	// Inject the vscode API into the webview
	panel.webview.html = getWebviewContent([], 1, 1, lastActiveEditor); // Initial empty content


}

function getWebviewContent(tweets: Tweet[], currentPage: number, totalPages: number, lastActiveEditor: vscode.TextEditor | undefined): string {
	return `
<!DOCTYPE html>
<html>
<head>
		<style>
				body {
						font-family: 'Arial', sans-serif;
						background: linear-gradient(135deg, #1e1e2f, #2a2a40);
						color: #fff;
						margin: 0;
						padding: 20px;
				}
				h1 {
						text-align: center;
						font-size: 2.5em;
						background: linear-gradient(90deg, #ff7e5f, #feb47b);
						-webkit-background-clip: text;
						-webkit-text-fill-color: transparent;
				}
				table {
						width: 100%;
						border-collapse: collapse;
						background: rgba(255, 255, 255, 0.1);
						backdrop-filter: blur(10px);
						border-radius: 10px;
						overflow: hidden;
						box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
				}
				th, td {
						padding: 15px;
						text-align: left;
						border-bottom: 1px solid rgba(255, 255, 255, 0.1);
				}
				th {
						background: linear-gradient(90deg, #ff7e5f, #feb47b);
						color: #fff;
				}
				tr:hover {
						background: rgba(255, 255, 255, 0.05);
				}
				.insert-button {
						padding: 5px 10px;
						border: none;
						border-radius: 5px;
						background: linear-gradient(90deg, #00c6ff, #0072ff);
						color: #fff;
						cursor: pointer;
				}
				.insert-button:hover {
						background: linear-gradient(90deg, #0072ff, #00c6ff);
				}
				.search {
						margin-bottom: 20px;
						display: flex;
						justify-content: center;
				}
				.search input {
						padding: 10px;
						border: none;
						border-radius: 5px;
						width: 300px;
						background: rgba(255, 255, 255, 0.1);
						color: #fff;
						margin-right: 10px;
				}
				.search button {
						padding: 10px 20px;
						border: none;
						border-radius: 5px;
						background: linear-gradient(90deg, #ff7e5f, #feb47b);
						color: #fff;
						cursor: pointer;
				}
				.pagination {
						margin-top: 20px;
						display: flex;
						justify-content: center;
						align-items: center;
				}
				.pagination button {
						padding: 10px 20px;
						border: none;
						border-radius: 5px;
						background: linear-gradient(90deg, #ff7e5f, #feb47b);
						color: #fff;
						cursor: pointer;
						margin: 0 5px;
				}
				.pagination button:disabled {
						background: #555;
						cursor: not-allowed;
				}
				.pagination span {
						margin: 0 10px;
						color: #fff;
				}
		</style>
		<script>
				// Inject the vscode API
				const vscode = acquireVsCodeApi();
		</script>
</head>
<body>
		<h1>Tweet Viewer</h1>
		<div class="search">
				<input type="text" id="searchInput" placeholder="Search tweets..." />
				<button onclick="filterTweets()">Search</button>
		</div>
		<table>
				<thead>
						<tr>
								<th>Title</th>
								<th>Content</th>
								<th>Author</th>
								<th>Date</th>
								<th>Action</th>
						</tr>
				</thead>
				<tbody>
						${tweets.map(tweet => `
								<tr>
										<td>${tweet.title}</td>
										<td>${tweet.content}</td>
										<td>${tweet.name}</td>
										<td>${new Date(tweet.date).toLocaleString()}</td>
										<td>
												<button class="insert-button" onclick="insertContent('${tweet.content.replace(/'/g, "\\'")}')">Insert</button>
										</td>
								</tr>
						`).join('')}
				</tbody>
		</table>
		<div class="pagination">
				<button onclick="navigate(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>
				<span>Page ${currentPage} of ${totalPages}</span>
				<button onclick="navigate(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
		</div>
		<script>
				function filterTweets() {
						const searchTerm = document.getElementById('searchInput').value.toLowerCase();
						const rows = document.querySelectorAll('tbody tr');
						rows.forEach(row => {
								const text = row.innerText.toLowerCase();
								row.style.display = text.includes(searchTerm) ? '' : 'none';
						});
				}

				function navigate(page) {
						if (page < 1 || page > ${totalPages}) return;
						window.vscode.postMessage({ command: 'navigate', page });
				}

				function insertContent(content) {
						window.vscode.postMessage({ command: 'insert', content });
				}
		</script>
</body>
</html>
	`;
}
