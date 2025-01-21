import { MongoClient, Db, Collection } from 'mongodb';

export interface EmbeddingResponse {
    model: string;
    object: string;
    data: Array<{
        index: number;
        object: string;
        embedding: number[];
    }>;
}

export interface EmbeddingsClientOptions {
    apiKey: string;
    baseUrl?: string;
}

export class EmbeddingsClient {
    private apiKey: string;
    private baseUrl: string;

    constructor(options: EmbeddingsClientOptions) {
        this.apiKey = options.apiKey;
        this.baseUrl = options.baseUrl || 'https://api.together.com';
    }

    private async request<T>(endpoint: string, body: Record<string, any>): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        return await response.json();
    }

    async createEmbedding(model: string, input: string | string[]): Promise<EmbeddingResponse> {
        const body = {
            model,
            input,
        };

        return await this.request<EmbeddingResponse>('/v1/embeddings', body);
    }
}

export interface MongoDBClientOptions {
    uri: string;
    databaseName: string;
    collectionName: string;
}

export class RAGMongoDB {
    private client: MongoClient;
    private db: Db;
    private collection: Collection;

    constructor(private options: MongoDBClientOptions) {
        this.client = new MongoClient(options.uri);
    }

    async connect(): Promise<void> {
        await this.client.connect();
        this.db = this.client.db(this.options.databaseName);
        this.collection = this.db.collection(this.options.collectionName);
    }

    async storeEmbedding(text: string, embedding: number[]): Promise<void> {
        await this.collection.insertOne({
            text,
            embedding,
        });
    }

    async searchSimilarEmbeddings(queryEmbedding: number[], topK: number): Promise<any[]> {
        const pipeline = [
            {
                $addFields: {
                    similarity: {
                        $let: {
                            vars: { query: queryEmbedding },
                            in: {
                                $reduce: {
                                    input: { $zip: { inputs: ["$embedding", "$$query"] } },
                                    initialValue: 0,
                                    in: {
                                        $add: ["$$value", { $multiply: ["$$this.0", "$$this.1"] }],
                                    },
                                },
                            },
                        },
                    },
                },
            },
            { $sort: { similarity: -1 } },
            { $limit: topK },
        ];

        return await this.collection.aggregate(pipeline).toArray();
    }

    async close(): Promise<void> {
        await this.client.close();
    }
}

// Example usage
(async () => {
    const embeddingsClient = new EmbeddingsClient({ apiKey: 'your-api-key-here' });
    const mongoOptions: MongoDBClientOptions = {
        uri: 'mongodb://localhost:27017',
        databaseName: 'ragDatabase',
        collectionName: 'embeddings',
    };

    const ragDB = new RAGMongoDB(mongoOptions);
    await ragDB.connect();

    const text = 'Our solar system orbits the Milky Way galaxy at about 515,000 mph';
    const embeddingResponse = await embeddingsClient.createEmbedding(
        'togethercomputer/m2-bert-80M-8k-retrieval',
        text
    );

    const embedding = embeddingResponse.data[0].embedding;
    await ragDB.storeEmbedding(text, embedding);

    const queryEmbedding = embedding; // For testing, use the same embedding
    const similarEmbeddings = await ragDB.searchSimilarEmbeddings(queryEmbedding, 5);

    console.log('Similar Embeddings:', similarEmbeddings);

    await ragDB.close();
})();
