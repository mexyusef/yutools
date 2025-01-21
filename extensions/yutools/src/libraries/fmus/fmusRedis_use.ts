import { FMUSRedis } from './fmusRedis';

const redisConnectionString = 'redis://user:password@localhost:6379';
const redisKey = 'fmus-data';
const fmusFilePath = './data.fmus';

async function main() {
  const fmusRedis = new FMUSRedis(redisConnectionString);

  // Import FMUS file into Redis
  await fmusRedis.importFromFile(redisKey, fmusFilePath);
  console.log('FMUS data imported to Redis.');

  // Export FMUS data from Redis to file
  const exportFilePath = './exported.fmus';
  await fmusRedis.exportToFile(redisKey, exportFilePath);
  console.log('FMUS data exported to file.');

  await fmusRedis.close();
}

main().catch(console.error);
