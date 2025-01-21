import * as vscode from 'vscode';
import { getRedisClient } from './getRedisClient';

export async function getBookmarks(key: string): Promise<vscode.Uri[]> {
  const client = await getRedisClient();
  const bookmarks = await client.get(key);
  return bookmarks ? JSON.parse(bookmarks) : [];
}
