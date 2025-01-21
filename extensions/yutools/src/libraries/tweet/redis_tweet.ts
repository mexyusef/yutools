import * as vscode from 'vscode';
import { getRedisClient } from './redisClient';

interface Tweet {
	id: string;
	content: string;
	title: string;
	name: string;
	date: string;
	// createdAt: string; // Timestamp (e.g., ISO string)
	// updatedAt: string; // Timestamp (e.g., ISO string)
}

export async function createTweet(): Promise<void> {
	const content = await vscode.window.showInputBox({
		prompt: 'Enter your tweet',
		placeHolder: 'What\'s on your mind?',
	});

	if (!content) {
		return;
	}

	const tweet: Tweet = {
		id: Date.now().toString(),
		content,
		name: 'Yusef',
		date: new Date().toISOString(),
		title: content.substring(0, 50), // First 50 chars as title
	};

	const redisClient = await getRedisClient();
	await redisClient.hSet('tweets', tweet.id, JSON.stringify(tweet));
	vscode.window.showInformationMessage('Tweet saved!');
}

export async function deleteTweet(): Promise<void> {
	const redisClient = await getRedisClient();

	// Fetch all tweets from Redis
	const tweets = await redisClient.hGetAll('tweets');
	const tweetList: Tweet[] = Object.values(tweets).map(tweet => JSON.parse(tweet));

	if (tweetList.length === 0) {
		vscode.window.showInformationMessage('No tweets found to delete.');
		return;
	}

	// Show quick pick menu with tweet content
	const selectedTweet = await vscode.window.showQuickPick(
		tweetList.map(tweet => tweet.content), // Show tweet content in the list
		{ placeHolder: 'Select a tweet to delete' }
	);

	if (!selectedTweet) {
		return; // User canceled the selection
	}

	const confirm = await vscode.window.showQuickPick(['Yes', 'No'], {
		placeHolder: 'Are you sure you want to delete this tweet?',
	});
	if (confirm !== 'Yes') {
		return;
	}
	// Find the tweet ID based on the selected content
	const tweetToDelete = tweetList.find(tweet => tweet.content === selectedTweet);
	if (!tweetToDelete) {
		vscode.window.showErrorMessage('Failed to find the selected tweet.');
		return;
	}

	// Delete the tweet from Redis
	await redisClient.hDel('tweets', tweetToDelete.id);
	vscode.window.showInformationMessage('Tweet deleted successfully!');
}

import { createWebview } from './webview';
import { createWebviewTable } from './tweet_webview';

export function register_redis_tweet_commands(context: vscode.ExtensionContext): void {
	context.subscriptions.push(
		vscode.commands.registerCommand('yutools.tweet.redis.createTweet', createTweet),
		vscode.commands.registerCommand('yutools.tweet.redis.deleteTweet', deleteTweet),
		vscode.commands.registerCommand('yutools.tweet.redis.viewTweets', () => {
			// console.log('📜 View Tweets command triggered');
			// createWebview();
			createWebviewTable();
		})
	);
}
