import * as vscode from 'vscode';
import { createClient } from 'redis';
import { getConfigValue } from '@/configs';
import { logger } from '@/yubantu/extension/logger';

export let redisClient: ReturnType<typeof createClient> | null = null;

export async function getRedisClient() {
  if (!redisClient) {
    const redisUrl = getConfigValue("redis_ulumus_shivering_thrive059", "redis://localhost:6379");

    // logger.log(`

    //   Trying to connect to ${redisUrl}.

    // `);

    redisClient = createClient({ url: redisUrl });
    redisClient.on('error', (err) => {
      // console.error('Redis error:', err);
    });
    await redisClient.connect();
  }
  return redisClient;
}