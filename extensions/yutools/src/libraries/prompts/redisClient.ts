import { createClient, RedisClientType } from 'redis';
import * as vscode from 'vscode';

let redisClient: RedisClientType | null = null;

export async function initializeRedisClient(): Promise<RedisClientType> {
	if (!redisClient) {
		const redisUrl = vscode.workspace.getConfiguration('yutools').get<string>('redis_binsar_binsilounruffled946');
		if (!redisUrl) {
			throw new Error('Redis URL is not configured.');
		}
		redisClient = createClient({ url: redisUrl });

		redisClient.on('error', (err) => {
			// console.error('Redis error:', err);
		});

		await redisClient.connect();
		console.log(`Redis connected successfully to ${redisUrl}.`);
	}
	return redisClient;
}

export function getRedisClient(): RedisClientType {
	if (!redisClient) {
		throw new Error('Redis client is not initialized.');
	}
	return redisClient;
}
