import * as vscode from 'vscode';
import { initializeDatabase, insertTweet, fetchTweets, updateTweet, deleteTweet } from './sqlite';
import { TweetProvider } from './tweetProvider';

export function register_tweet_commands(context: vscode.ExtensionContext) {
	initializeDatabase();

	const tweetProvider = new TweetProvider();
	vscode.window.registerTreeDataProvider('tweets', tweetProvider);

	context.subscriptions.push(
		vscode.commands.registerCommand('yutools.createTweet', async () => {
			const content = await vscode.window.showInputBox({ prompt: 'Enter your tweet' });
			if (content) {
				await insertTweet(content);
				vscode.window.showInformationMessage('Tweet saved!');
				tweetProvider.refresh();
			}
		}),

		vscode.commands.registerCommand('yutools.editTweet', async (item) => {
			const newContent = await vscode.window.showInputBox({ prompt: 'Edit your tweet', value: item.content });
			if (newContent) {
				await updateTweet(item.id, newContent);
				vscode.window.showInformationMessage('Tweet updated!');
				tweetProvider.refresh();
			}
		}),

		vscode.commands.registerCommand('yutools.deleteTweet', async (item) => {
			await deleteTweet(item.id);
			vscode.window.showInformationMessage('Tweet deleted!');
			tweetProvider.refresh();
		})
	);
}
