import Database from 'better-sqlite3';

export interface Tweet {
	id: number;
	content: string;
	tags: string;
	createdAt: string;
}

interface TagFrequency {
	tag: string;
	count: number;
}

export class DatabaseHelper {
	private db: Database.Database;

	constructor(dbPath: string) {
		this.db = new Database(dbPath);
		this.setup();
	}

	private setup() {
		// Ensure the table exists
		this.db.prepare(`
      CREATE TABLE IF NOT EXISTS tweets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        tags TEXT,
        createdAt TEXT NOT NULL
      )
    `).run();
	}

	// Add a tweet to the database
	addTweet(content: string, tags: string): void {
		const stmt = this.db.prepare(`
      INSERT INTO tweets (content, tags, createdAt)
      VALUES (?, ?, ?)
    `);
		stmt.run(content, tags, new Date().toISOString());
	}

	getTweets(): Tweet[] {
		const tweetsSnapshot = this.db.prepare('SELECT * FROM tweets').all();
		return tweetsSnapshot.map((row: any) => ({
			id: row.id,
			content: row.content,
			tags: row.tags,
			createdAt: row.createdAt,
		}));
	}

	// Method to fetch tweets by a specific date
	getTweetsByDate(date: string): Tweet[] {
		const stmt = this.db.prepare('SELECT * FROM tweets WHERE createdAt LIKE ?');
		const rows = stmt.all(`${date}%`);
		return rows.map((row: any) => ({
			id: row.id,
			content: row.content,
			tags: row.tags,
			createdAt: row.createdAt,
		}));
	}

	// Define the updateTags method
	updateTags(tweetId: number, tags: string): void {
		const stmt = this.db.prepare('UPDATE tweets SET tags = ? WHERE id = ?');
		stmt.run(tags, tweetId);
	}

	updateTweet(id: number, newContent: string) {
		const stmt = this.db.prepare('UPDATE tweets SET content = ? WHERE id = ?');
		stmt.run(newContent, id);
	}

	deleteTweet(id: number) {
		const stmt = this.db.prepare('DELETE FROM tweets WHERE id = ?');
		stmt.run(id);
	}

	// Get all tags from tweets
	getAllTags(): string[] {
		const stmt = this.db.prepare('SELECT tags FROM tweets WHERE tags IS NOT NULL');
		const rows = stmt.all() as { tags: string }[];

		const tagsSet = new Set<string>();

		rows.forEach((row) => {
			row.tags.split(',').forEach(tag => tagsSet.add(tag.trim()));
		});

		return Array.from(tagsSet);
	}

	// Get tweets filtered by tags
	getTweetsByTags(tags: string[]): Tweet[] {
		const conditions = tags.map(() => `tags LIKE ?`).join(' OR ');
		const stmt = this.db.prepare(`SELECT * FROM tweets WHERE ${conditions}`);
		const params = tags.map(tag => `%${tag}%`);
		return stmt.all(...params) as Tweet[];
	}

	// Get tag frequencies (for tag cloud)
	getTagFrequencies(): TagFrequency[] {
		const stmt = this.db.prepare('SELECT tags FROM tweets WHERE tags IS NOT NULL');
		const rows = stmt.all() as { tags: string }[];

		const tagCounts: Record<string, number> = {};

		rows.forEach((row) => {
			if (row.tags) {
				row.tags.split(',').forEach((tag) => {
					const trimmedTag = tag.trim();
					tagCounts[trimmedTag] = (tagCounts[trimmedTag] || 0) + 1;
				});
			}
		});

		return Object.entries(tagCounts)
			.map(([tag, count]) => ({ tag, count }))
			.sort((a, b) => b.count - a.count);
	}

	// Get default tags based on tweet content (simplified)
	getDefaultTags(content: string): string[] {
		const tagMappings: Record<string, string[]> = {
			work: ['project', 'deadline', 'meeting'],
			personal: ['family', 'friends', 'vacation'],
			fun: ['party', 'game', 'movie'],
		};

		const defaultTags = new Set<string>();

		for (const [tag, keywords] of Object.entries(tagMappings)) {
			if (keywords.some(keyword => content.toLowerCase().includes(keyword))) {
				defaultTags.add(tag);
			}
		}

		return Array.from(defaultTags);
	}
}
