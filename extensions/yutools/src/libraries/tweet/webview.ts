import * as vscode from 'vscode';
import { getRedisClient } from './redisClient';

interface Tweet {
	id: string;
	content: string;
	name: string;
	date: string;
	title: string;
}

export function createWebview(): void {
	const panel = vscode.window.createWebviewPanel(
		'tweetViewer',
		'Tweet Viewer',
		vscode.ViewColumn.One,
		{ enableScripts: true }
	);

	let currentPage = 1;

	async function updateWebview(page: number = 1): Promise<void> {
		const redisClient = await getRedisClient();
		const tweets = await redisClient.hGetAll('tweets');
		const tweetList: Tweet[] = Object.values(tweets).map(tweet => JSON.parse(tweet));

		// Pagination logic
		const perPage = 15;
		const start = (page - 1) * perPage;
		const end = start + perPage;
		const paginatedTweets = tweetList.slice(start, end);

		panel.webview.html = getWebviewContent(paginatedTweets, page, Math.ceil(tweetList.length / perPage));
	}

	// Initial render
	updateWebview(currentPage);

	// Handle messages from the webview (e.g., pagination)
	panel.webview.onDidReceiveMessage(async (message: { command: string; page: number }) => {
		if (message.command === 'navigate') {
			currentPage = message.page;
			await updateWebview(currentPage);
		}
	});
}

function getWebviewContent(tweets: Tweet[], currentPage: number, totalPages: number): string {
	return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                .tweet { border: 1px solid #ccc; padding: 10px; margin-bottom: 10px; }
                .search { margin-bottom: 20px; }
                .pagination { margin-top: 20px; }
                .pagination button { margin: 0 5px; }
            </style>
        </head>
        <body>
            <div class="search">
                <input type="text" id="searchInput" placeholder="Search tweets..." />
                <button onclick="filterTweets()">Search</button>
            </div>
            ${tweets.map(tweet => `
                <div class="tweet">
                    <h3>${tweet.title}</h3>
                    <p>${tweet.content}</p>
                    <small>By ${tweet.name} on ${new Date(tweet.date).toLocaleString()}</small>
                </div>
            `).join('')}
            <div class="pagination">
                <button onclick="navigate(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>
                <span>Page ${currentPage} of ${totalPages}</span>
                <button onclick="navigate(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
            </div>
            <script>
                function filterTweets() {
                    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
                    const tweets = document.querySelectorAll('.tweet');
                    tweets.forEach(tweet => {
                        const text = tweet.innerText.toLowerCase();
                        tweet.style.display = text.includes(searchTerm) ? 'block' : 'none';
                    });
                }

                function navigate(page) {
                    if (page < 1 || page > ${totalPages}) return;
                    window.vscode.postMessage({ command: 'navigate', page });
                }
            </script>
        </body>
        </html>
    `;
}
