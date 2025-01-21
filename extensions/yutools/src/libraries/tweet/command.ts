import * as vscode from 'vscode';
import { DatabaseHelper, Tweet } from './DatabaseHelper';

const db = new DatabaseHelper('./tweets.db');

// Add Tweet Command
export const addTweetCommand = vscode.commands.registerCommand('yutools.tweet.addTweet', async () => {
	const tweetContent = await vscode.window.showInputBox({
		prompt: 'Enter your tweet',
		placeHolder: 'Write something...',
	});

	if (tweetContent) {
		const defaultTags = db.getDefaultTags(tweetContent);
		const selectedTags = await vscode.window.showQuickPick(
			[...defaultTags, 'No Tag'],
			{ canPickMany: true, placeHolder: 'Select default tags or add custom tags' }
		) ?? [];

		const tags = selectedTags.filter(tag => tag !== 'No Tag').join(', ');
		db.addTweet(tweetContent, tags);
		vscode.window.showInformationMessage('Tweet added successfully!');
	}
});

// List Tweets Command
export const listTweetsCommand = vscode.commands.registerCommand('yutools.tweet.listTweets', async () => {
	const tweets: Tweet[] = db.getTweets();
	if (tweets.length === 0) {
		vscode.window.showInformationMessage('No tweets found!');
		return;
	}

	const items = tweets.map(tweet => ({ label: tweet.content, id: tweet.id }));
	const selected = await vscode.window.showQuickPick(items, {
		canPickMany: false,
		placeHolder: 'Select a tweet to edit or delete',
	});

	if (selected) {
		const action = await vscode.window.showQuickPick(['Edit', 'Delete'], {
			placeHolder: 'Choose an action',
		});

		if (action === 'Edit') {
			const newContent = await vscode.window.showInputBox({
				prompt: 'Edit your tweet',
				value: selected.label,
			});
			if (newContent) {
				db.updateTweet(selected.id, newContent);
				vscode.window.showInformationMessage('Tweet updated!');
			}
		} else if (action === 'Delete') {
			db.deleteTweet(selected.id);
			vscode.window.showInformationMessage('Tweet deleted!');
		}
	}
});

// Search Tweets Command
export const searchTweetsCommand = vscode.commands.registerCommand('yutools.tweet.searchTweets', async () => {
	const query = await vscode.window.showInputBox({ prompt: 'Enter a keyword to search tweets' });
	if (query) {
		const tweets = db.getTweets().filter(tweet => tweet.content.includes(query));
		if (tweets.length === 0) {
			vscode.window.showInformationMessage('No tweets found matching your search!');
			return;
		}

		const items = tweets.map(tweet => ({ label: tweet.content, id: tweet.id }));
		await vscode.window.showQuickPick(items, {
			canPickMany: false,
			placeHolder: 'Search results',
		});
	}
});

// Filter Tweets By Date Command
export const filterTweetsByDateCommand = vscode.commands.registerCommand('yutools.tweet.filterTweetsByDate', async () => {
	const date = await vscode.window.showInputBox({ prompt: 'Enter a date (YYYY-MM-DD) to filter tweets' });
	if (date) {
		const tweets: Tweet[] = db.getTweetsByDate(date);
		if (tweets.length === 0) {
			vscode.window.showInformationMessage('No tweets found for the specified date!');
			return;
		}

		const items = tweets.map(tweet => ({ label: tweet.content, id: tweet.id }));
		await vscode.window.showQuickPick(items, {
			canPickMany: false,
			placeHolder: `Tweets from ${date}`,
		});
	}
});

// Export Tweets Command
export const exportTweetsCommand = vscode.commands.registerCommand('yutools.tweet.exportTweets', async () => {
	const tweets: Tweet[] = db.getTweets();
	const tweetsText = tweets.map(tweet => tweet.content).join('\n');
	const uri = await vscode.window.showSaveDialog({ filters: { 'Text Files': ['txt'] } });

	if (uri) {
		const fs = require('fs');
		fs.writeFileSync(uri.fsPath, tweetsText, 'utf-8');
		vscode.window.showInformationMessage('Tweets exported successfully!');
	}
});

// Import Tweets Command
export const importTweetsCommand = vscode.commands.registerCommand('yutools.tweet.importTweets', async () => {
	const uri = await vscode.window.showOpenDialog({ filters: { 'Text Files': ['txt'] }, canSelectMany: false });
	if (uri && uri[0]) {
		const fs = require('fs');
		const filePath = uri[0].fsPath;

		try {
			const content = fs.readFileSync(filePath, 'utf-8');
			const tweets = content.split('\n').filter((line: string) => line.trim() !== '');

			tweets.forEach((tweetLine: string) => {
				const [tweetContent, tags] = tweetLine.split(';'); // Assuming semicolon separates content and tags
				db.addTweet(tweetContent.trim(), tags.trim()); // Adjust this according to your file format
			});

			vscode.window.showInformationMessage(`${tweets.length} tweets imported successfully!`);
		} catch (error) {
			vscode.window.showErrorMessage('Error reading or processing the file!');
		}
	}
});

// import * as vscode from 'vscode';
// import { addTweetCommand, listTweetsCommand, searchTweetsCommand, filterTweetsByDateCommand, exportTweetsCommand, importTweetsCommand } from './commands';

export function register_tweet_commands(context: vscode.ExtensionContext) {
	context.subscriptions.push(addTweetCommand);
	context.subscriptions.push(listTweetsCommand);
	context.subscriptions.push(searchTweetsCommand);
	context.subscriptions.push(filterTweetsByDateCommand);
	context.subscriptions.push(exportTweetsCommand);
	context.subscriptions.push(importTweetsCommand);
}
