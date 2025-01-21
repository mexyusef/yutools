import Redis from 'ioredis';
import { FMUSParser, FMUSItem } from './fmusParser';

export class FMUSRedis {
  private redis: Redis;

  constructor(connectionString: string) {
    this.redis = new Redis(connectionString);
  }

  async saveFMUS(key: string, fmusItems: FMUSItem[]): Promise<void> {
    const serialized = JSON.stringify(fmusItems);
    await this.redis.set(key, serialized);
  }

  async loadFMUS(key: string): Promise<FMUSItem[] | null> {
    const serialized = await this.redis.get(key);
    if (!serialized) {
      return null;
    }
    return JSON.parse(serialized) as FMUSItem[];
  }

  async importFromFile(key: string, filePath: string): Promise<void> {
    const fmusItems = FMUSParser.parseFile(filePath);
    await this.saveFMUS(key, fmusItems);
  }

  async exportToFile(key: string, filePath: string): Promise<void> {
    const fmusItems = await this.loadFMUS(key);
    if (!fmusItems) {
      throw new Error(`No FMUS data found for key: ${key}`);
    }
    FMUSParser.writeToFile(filePath, fmusItems);
  }

  async close(): Promise<void> {
    await this.redis.quit();
  }
}
