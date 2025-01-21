import * as vscode from 'vscode';
import { MongoClient } from 'mongodb';

let mongoClient: MongoClient | null = null;
const DEFAULT_MONGOURI = "mongodb://localhost:27017"; // Replace with configurable settings

// context.subscriptions.push(
//   createDatabase,
//   deleteDatabase,
//   createCollection,
//   deleteCollection,
//   insertDocument,
//   deleteDocument,
//   queryDocuments,
//   createDatabase,
//   setMongoURICommand,
//   getMongoURICommand,
// );

export function deactivate() {
  if (mongoClient) mongoClient.close();
}

// Deactivate Mongo Client
const deactivateMongo = () => {
  if (mongoClient) {
    mongoClient.close();
    mongoClient = null;
    vscode.window.showInformationMessage('Disconnected from MongoDB.');
  }
};

// Retrieve MongoDB URI from the configuration
function getMongoURI(): string {
  const config = vscode.workspace.getConfiguration('yutools.databases');
  return config.get<string>('mongodb') || DEFAULT_MONGOURI;
}

// Update MongoDB URI in the configuration
async function setMongoURI(uri: string) {
  const config = vscode.workspace.getConfiguration('yutools.databases');
  await config.update('mongodb', uri, vscode.ConfigurationTarget.Global);
}

async function connectToMongoDB(uri: string): Promise<MongoClient> {
  if (!mongoClient) {
    mongoClient = new MongoClient(uri);
    await mongoClient.connect();
  }
  return mongoClient;
}

const createDatabase = vscode.commands.registerCommand('yutools.mongo.createDatabase',
  async () => {
    const dbName = await vscode.window.showInputBox({ prompt: 'Enter the database name' });
    if (!dbName) return;

    const mongoURI = getMongoURI();
    const client = await connectToMongoDB(mongoURI);
    await client.db(dbName).command({ ping: 1 });
    vscode.window.showInformationMessage(`Database "${dbName}" created successfully.`);
  });

// const createDatabase = vscode.commands.registerCommand('yutools.mongo.createDatabase', 
//   async () => {
//   const dbName = await vscode.window.showInputBox({ prompt: "Enter the database name" });
//   if (!dbName) return;

//   const client = await connectToMongoDB(mongoURI);
//   await client.db(dbName).command({ ping: 1 });
//   vscode.window.showInformationMessage(`Database "${dbName}" created successfully.`);
// });

const setMongoURICommand = vscode.commands.registerCommand('yutools.mongo.setMongoURI',
  async () => {
    const newURI = await vscode.window.showInputBox({
      prompt: 'Enter the new MongoDB URI',
      value: getMongoURI(),
    });
    if (!newURI) return;

    await setMongoURI(newURI);
    vscode.window.showInformationMessage(`MongoDB URI updated to "${newURI}"`);
  });

const getMongoURICommand = vscode.commands.registerCommand('yutools.mongo.getMongoURI',
  async () => {
    const mongoURI = getMongoURI();
    vscode.window.showInformationMessage(`Current MongoDB URI: "${mongoURI}"`);
  });


const deleteDatabase = vscode.commands.registerCommand('yutools.mongo.deleteDatabase',
  async () => {
    const dbName = await vscode.window.showInputBox({ prompt: "Enter the database name to delete" });
    if (!dbName) return;
    const mongoURI = getMongoURI();
    const client = await connectToMongoDB(mongoURI);
    await client.db(dbName).dropDatabase();
    vscode.window.showInformationMessage(`Database "${dbName}" deleted successfully.`);
  });

const createCollection = vscode.commands.registerCommand('yutools.mongo.createCollection',
  async () => {
    const dbName = await vscode.window.showInputBox({ prompt: "Enter the database name" });
    const collectionName = await vscode.window.showInputBox({ prompt: "Enter the collection name" });
    if (!dbName || !collectionName) return;
    const mongoURI = getMongoURI();
    const client = await connectToMongoDB(mongoURI);
    await client.db(dbName).createCollection(collectionName);
    vscode.window.showInformationMessage(`Collection "${collectionName}" created in database "${dbName}".`);
  });

const deleteCollection = vscode.commands.registerCommand('yutools.mongo.deleteCollection',
  async () => {
    const dbName = await vscode.window.showInputBox({ prompt: "Enter the database name" });
    const collectionName = await vscode.window.showInputBox({ prompt: "Enter the collection name to delete" });
    if (!dbName || !collectionName) return;
    const mongoURI = getMongoURI();
    const client = await connectToMongoDB(mongoURI);
    await client.db(dbName).collection(collectionName).drop();
    vscode.window.showInformationMessage(`Collection "${collectionName}" deleted from database "${dbName}".`);
  });

const insertDocument = vscode.commands.registerCommand('yutools.mongo.insertDocument',
  async () => {
    const dbName = await vscode.window.showInputBox({ prompt: "Enter the database name" });
    const collectionName = await vscode.window.showInputBox({ prompt: "Enter the collection name" });
    const documentJSON = await vscode.window.showInputBox({ prompt: "Enter document JSON" });
    if (!dbName || !collectionName || !documentJSON) return;
    const mongoURI = getMongoURI();
    const client = await connectToMongoDB(mongoURI);
    const document = JSON.parse(documentJSON);
    await client.db(dbName).collection(collectionName).insertOne(document);
    vscode.window.showInformationMessage(`Document inserted into collection "${collectionName}".`);
  });

const deleteDocument = vscode.commands.registerCommand('yutools.mongo.deleteDocument',
  async () => {
    const dbName = await vscode.window.showInputBox({ prompt: "Enter the database name" });
    const collectionName = await vscode.window.showInputBox({ prompt: "Enter the collection name" });
    const filterJSON = await vscode.window.showInputBox({ prompt: "Enter filter JSON for deletion" });
    if (!dbName || !collectionName || !filterJSON) return;
    const mongoURI = getMongoURI();
    const client = await connectToMongoDB(mongoURI);
    const filter = JSON.parse(filterJSON);
    await client.db(dbName).collection(collectionName).deleteOne(filter);
    vscode.window.showInformationMessage(`Document deleted from collection "${collectionName}".`);
  });

const queryDocuments = vscode.commands.registerCommand('yutools.mongo.queryDocuments',
  async () => {
    const dbName = await vscode.window.showInputBox({ prompt: "Enter the database name" });
    const collectionName = await vscode.window.showInputBox({ prompt: "Enter the collection name" });
    const filterJSON = await vscode.window.showInputBox({ prompt: "Enter filter JSON for query" });
    if (!dbName || !collectionName || !filterJSON) return;
    const mongoURI = getMongoURI();
    const client = await connectToMongoDB(mongoURI);
    const filter = JSON.parse(filterJSON);
    const results = await client.db(dbName).collection(collectionName).find(filter).toArray();
    vscode.window.showInformationMessage(`Query Results: ${JSON.stringify(results, null, 2)}`);
  });
