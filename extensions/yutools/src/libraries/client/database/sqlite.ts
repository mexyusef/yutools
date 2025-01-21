import * as sqlite3 from 'sqlite3';
const db = new sqlite3.Database('tweets.db');

export function initializeDatabase() {
	db.run(`
    CREATE TABLE IF NOT EXISTS tweets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

export function insertTweet(content: string): Promise<void> {
	return new Promise((resolve, reject) => {
		db.run(`INSERT INTO tweets (content) VALUES (?)`, [content], (err) => {
			if (err) reject(err);
			else resolve();
		});
	});
}

// export function fetchTweets(): Promise<{ id: number; content: string }[]> {
// 	return new Promise((resolve, reject) => {
// 		db.all(`SELECT id, content FROM tweets`, [], (err, rows) => {
// 			if (err) reject(err);
// 			else resolve(rows);
// 		});
// 	});
// }
export function fetchTweets(): Promise<{ id: number; content: string }[]> {
	return new Promise((resolve, reject) => {
		db.all(`SELECT id, content FROM tweets`, [], (err, rows: unknown[]) => {
			if (err) {
				reject(err);
			} else {
				resolve(rows as { id: number; content: string }[]); // Explicit type assertion
			}
		});
	});
}

export function updateTweet(id: number, content: string): Promise<void> {
	return new Promise((resolve, reject) => {
		db.run(`UPDATE tweets SET content = ? WHERE id = ?`, [content, id], (err) => {
			if (err) reject(err);
			else resolve();
		});
	});
}

export function deleteTweet(id: number): Promise<void> {
	return new Promise((resolve, reject) => {
		db.run(`DELETE FROM tweets WHERE id = ?`, [id], (err) => {
			if (err) reject(err);
			else resolve();
		});
	});
}
