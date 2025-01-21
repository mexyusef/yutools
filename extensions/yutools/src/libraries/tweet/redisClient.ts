import { createClient, RedisClientType } from 'redis';
import * as vscode from 'vscode';

let redisClient: RedisClientType | null = null;

export async function getRedisClient(): Promise<RedisClientType> {
	if (!redisClient) {
		const redisUrl = vscode.workspace.getConfiguration('yutools').get<string>('redis_tarfahmiz_simpleloginnewsletterendowment724');
		if (!redisUrl) {
			throw new Error('Redis URL is not configured.');
		}
		redisClient = createClient({ url: redisUrl });
		await redisClient.connect();
	}
	return redisClient;
}
