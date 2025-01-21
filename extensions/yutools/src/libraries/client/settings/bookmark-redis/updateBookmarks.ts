import * as vscode from 'vscode';
import { getRedisClient } from './getRedisClient';

export async function updateBookmarks(key: string, bookmarks: vscode.Uri[]): Promise<void> {
  // await redisClient.set(key, JSON.stringify(bookmarks));
  const client = await getRedisClient();
  await client.set(key, JSON.stringify(bookmarks));
}
