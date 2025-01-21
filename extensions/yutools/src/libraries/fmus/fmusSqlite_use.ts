import { FMUSSqlite } from './fmusSqlite';

const sqliteDbPath = './fmus.db';
const fmusFilePath = './data.fmus';

async function main() {
  const fmusSqlite = new FMUSSqlite(sqliteDbPath);

  // Connect to SQLite database
  await fmusSqlite.connect();

  // Import FMUS file into SQLite
  await fmusSqlite.importFromFile(fmusFilePath);
  console.log('FMUS data imported into SQLite.');

  // Export FMUS data from SQLite to file
  const exportFilePath = './exported.fmus';
  await fmusSqlite.exportToFile(exportFilePath);
  console.log('FMUS data exported to file.');

  // Close the database connection
  await fmusSqlite.close();
}

main().catch(console.error);
