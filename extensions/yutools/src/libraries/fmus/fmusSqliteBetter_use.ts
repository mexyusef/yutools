import { FMUSSqliteBetter } from './fmusSqliteBetter';

const sqliteDbPath = './fmus.db';
const fmusFilePath = './data.fmus';

async function main() {
  const fmusSqlite = new FMUSSqliteBetter(sqliteDbPath);

  // Import FMUS file into SQLite
  fmusSqlite.importFromFile(fmusFilePath);
  console.log('FMUS data imported into SQLite.');

  // Export FMUS data from SQLite to file
  const exportFilePath = './exported.fmus';
  fmusSqlite.exportToFile(exportFilePath);
  console.log('FMUS data exported to file.');

  // Close the database connection
  fmusSqlite.close();
}

main().catch(console.error);
