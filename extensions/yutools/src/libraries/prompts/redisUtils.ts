import { getRedisClient } from './redisClient';
import { Prompt } from './types';

export async function savePrompt(prompt: Prompt): Promise<void> {
	try {
		const redisClient = getRedisClient();
		await redisClient.hSet('prompts', prompt.id, JSON.stringify(prompt));
	} catch (error) {
		console.error('Failed to save prompt:', error);
		throw new Error('Failed to save prompt. Check the logs for details.');
	}
}

export async function getPrompt(id: string): Promise<Prompt | null> {
	try {
		const redisClient = getRedisClient();
		const prompt = await redisClient.hGet('prompts', id);
		return prompt ? JSON.parse(prompt) : null;
	} catch (error) {
		console.error('Failed to get prompt:', error);
		throw new Error('Failed to get prompt. Check the logs for details.');
	}
}

export async function getAllPrompts(): Promise<Prompt[]> {
	try {
		const redisClient = getRedisClient();
		const prompts = await redisClient.hGetAll('prompts');
		return Object.values(prompts).map((p) => JSON.parse(p));
	} catch (error) {
		console.error('Failed to get all prompts:', error);
		throw new Error('Failed to get all prompts. Check the logs for details.');
	}
}

export async function deletePrompt(id: string): Promise<void> {
	try {
		const redisClient = getRedisClient();
		await redisClient.hDel('prompts', id);
	} catch (error) {
		console.error('Failed to delete prompt:', error);
		throw new Error('Failed to delete prompt. Check the logs for details.');
	}
}
