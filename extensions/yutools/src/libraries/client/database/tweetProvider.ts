import * as vscode from 'vscode';
import { fetchTweets } from './sqlite';

export class TweetProvider implements vscode.TreeDataProvider<TweetItem> {
	private _onDidChangeTreeData: vscode.EventEmitter<TweetItem | undefined | void> = new vscode.EventEmitter<
		TweetItem | undefined | void
	>();
	readonly onDidChangeTreeData: vscode.Event<TweetItem | undefined | void> = this._onDidChangeTreeData.event;

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: TweetItem): vscode.TreeItem {
		return element;
	}

	async getChildren(): Promise<TweetItem[]> {
		const tweets = await fetchTweets();
		return tweets.map((tweet) => new TweetItem(String(tweet.id), tweet.content));  // Convert id to string
	}
}

class TweetItem extends vscode.TreeItem {
	constructor(public readonly id: string, public readonly content: string) {
		super(content, vscode.TreeItemCollapsibleState.None);
		this.contextValue = 'tweet';
	}
}
