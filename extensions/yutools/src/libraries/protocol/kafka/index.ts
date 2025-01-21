import * as vscode from 'vscode';
import { Kafka, logLevel } from 'kafkajs';

let kafka: Kafka | null = null;
let clusterConfig: { brokers: string[], clientId: string } | null = null;

/**
 * 1. Connect to a Kafka cluster.
 */
vscode.commands.registerCommand('yutools.kafka.connectCluster', async () => {
  const brokers = await vscode.window.showInputBox({
    placeHolder: 'Enter Kafka brokers (comma-separated, e.g., localhost:9092)',
  });

  const clientId = await vscode.window.showInputBox({
    placeHolder: 'Enter Client ID for Kafka connection',
  });

  if (brokers && clientId) {
    try {
      clusterConfig = { brokers: brokers.split(','), clientId };
      kafka = new Kafka({
        clientId,
        brokers: brokers.split(','),
        logLevel: logLevel.ERROR,
      });
      vscode.window.showInformationMessage(`Connected to Kafka cluster at ${brokers}`);
    } catch (error: any) {
      vscode.window.showErrorMessage(`Failed to connect: ${error.message}`);
    }
  }
});

/**
 * 2. List all topics in the connected cluster.
 */
vscode.commands.registerCommand('yutools.kafka.listTopics', async () => {
  if (!kafka) {
    vscode.window.showErrorMessage('Not connected to any Kafka cluster.');
    return;
  }

  try {
    const admin = kafka.admin();
    await admin.connect();
    const topics = await admin.listTopics();
    await admin.disconnect();

    vscode.window.showQuickPick(topics, {
      placeHolder: 'Topics in the Kafka cluster',
    });
  } catch (error: any) {
    vscode.window.showErrorMessage(`Failed to list topics: ${error.message}`);
  }
});

/**
 * 3. Create a new Kafka topic.
 */
vscode.commands.registerCommand('yutools.kafka.createTopic', async () => {
  if (!kafka) {
    vscode.window.showErrorMessage('Not connected to any Kafka cluster.');
    return;
  }

  const topicName = await vscode.window.showInputBox({
    placeHolder: 'Enter the name of the new topic',
  });

  if (topicName) {
    try {
      const admin = kafka.admin();
      await admin.connect();
      await admin.createTopics({
        topics: [{ topic: topicName }],
      });
      await admin.disconnect();
      vscode.window.showInformationMessage(`Topic "${topicName}" created successfully.`);
    } catch (error: any) {
      vscode.window.showErrorMessage(`Failed to create topic: ${error.message}`);
    }
  }
});

/**
 * 4. Delete an existing Kafka topic.
 */
vscode.commands.registerCommand('yutools.kafka.deleteTopic', async () => {
  if (!kafka) {
    vscode.window.showErrorMessage('Not connected to any Kafka cluster.');
    return;
  }

  const topicName = await vscode.window.showInputBox({
    placeHolder: 'Enter the name of the topic to delete',
  });

  if (topicName) {
    try {
      const admin = kafka.admin();
      await admin.connect();
      await admin.deleteTopics({ topics: [topicName] });
      await admin.disconnect();
      vscode.window.showInformationMessage(`Topic "${topicName}" deleted successfully.`);
    } catch (error: any) {
      vscode.window.showErrorMessage(`Failed to delete topic: ${error.message}`);
    }
  }
});

/**
 * 12. Refresh and fetch latest cluster metadata.
 */
vscode.commands.registerCommand('yutools.kafka.refreshCluster', async () => {
  if (!kafka) {
    vscode.window.showErrorMessage('Not connected to any Kafka cluster.');
    return;
  }

  try {
    const admin = kafka.admin();
    await admin.connect();
    const metadata = await admin.fetchTopicMetadata();
    await admin.disconnect();

    vscode.window.showInformationMessage(
      `Cluster refreshed. Found ${metadata.topics.length} topics.`
    );
  } catch (error: any) {
    vscode.window.showErrorMessage(`Failed to refresh cluster: ${error.message}`);
  }
});

// npm install kafkajs
