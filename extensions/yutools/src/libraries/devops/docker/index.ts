import * as vscode from 'vscode';
import Docker from 'dockerode';

const docker = new Docker();

async function startContainer() {
  const containers = await docker.listContainers({ all: true });
  const containerNames = containers.map(c => `${c.Names[0]} (${c.Id})`);
  const selectedContainer = await vscode.window.showQuickPick(containerNames, { placeHolder: 'Select a container to start' });

  if (selectedContainer) {
    const containerId = selectedContainer.match(/\(([^)]+)\)/)?.[1];
    if (containerId) {
      const container = docker.getContainer(containerId);
      await container.start();
      vscode.window.showInformationMessage(`Container ${containerId} started.`);
    }
  }
}

async function stopContainer() {
  const containers = await docker.listContainers();
  const containerNames = containers.map(c => `${c.Names[0]} (${c.Id})`);
  const selectedContainer = await vscode.window.showQuickPick(containerNames, { placeHolder: 'Select a container to stop' });

  if (selectedContainer) {
    const containerId = selectedContainer.match(/\(([^)]+)\)/)?.[1];
    if (containerId) {
      const container = docker.getContainer(containerId);
      await container.stop();
      vscode.window.showInformationMessage(`Container ${containerId} stopped.`);
    }
  }
}

async function restartContainer() {
  const containers = await docker.listContainers();
  const containerNames = containers.map(c => `${c.Names[0]} (${c.Id})`);
  const selectedContainer = await vscode.window.showQuickPick(containerNames, { placeHolder: 'Select a container to restart' });

  if (selectedContainer) {
    const containerId = selectedContainer.match(/\(([^)]+)\)/)?.[1];
    if (containerId) {
      const container = docker.getContainer(containerId);
      await container.restart();
      vscode.window.showInformationMessage(`Container ${containerId} restarted.`);
    }
  }
}

async function listRunningContainers() {
  const containers = await docker.listContainers();
  const containerList = containers.map(c => `${c.Names[0]} - ${c.Image} (Running)`);

  if (containerList.length === 0) {
    vscode.window.showInformationMessage('No running containers.');
  } else {
    vscode.window.showQuickPick(containerList, { placeHolder: 'Running containers' });
  }
}

async function removeContainer() {
  const containers = await docker.listContainers({ all: true });
  const containerNames = containers.map(c => `${c.Names[0]} (${c.Id})`);
  const selectedContainer = await vscode.window.showQuickPick(containerNames, { placeHolder: 'Select a container to remove' });

  if (selectedContainer) {
    const containerId = selectedContainer.match(/\(([^)]+)\)/)?.[1];
    if (containerId) {
      const container = docker.getContainer(containerId);
      await container.remove();
      vscode.window.showInformationMessage(`Container ${containerId} removed.`);
    }
  }
}

async function removeImage() {
  const images = await docker.listImages();
  const imageNames = images.map(i => i.RepoTags?.[0] || `<none>:${i.Id.slice(0, 12)}`);
  const selectedImage = await vscode.window.showQuickPick(imageNames, { placeHolder: 'Select an image to remove' });

  if (selectedImage) {
    const image = docker.getImage(selectedImage);
    await image.remove();
    vscode.window.showInformationMessage(`Image ${selectedImage} removed.`);
  }
}

async function buildImage() {
  const folderUri = await vscode.window.showOpenDialog({ canSelectFolders: true, openLabel: 'Select Folder to Build Image' });
  if (folderUri && folderUri[0]) {
    const imageName = await vscode.window.showInputBox({ prompt: 'Enter a name for the image' });
    if (imageName) {
      const tarStream = require('tar-fs').pack(folderUri[0].fsPath);
      await docker.buildImage(tarStream, { t: imageName });
      vscode.window.showInformationMessage(`Image ${imageName} built.`);
    }
  }
}

async function pruneResources() {
  await docker.pruneContainers();
  await docker.pruneImages();
  await docker.pruneVolumes();
  vscode.window.showInformationMessage('Pruned unused Docker resources.');
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('yutools.docker.startContainer', startContainer),
    vscode.commands.registerCommand('yutools.docker.stopContainer', stopContainer),
    vscode.commands.registerCommand('yutools.docker.restartContainer', restartContainer),
    vscode.commands.registerCommand('yutools.docker.listRunningContainers', listRunningContainers),
    vscode.commands.registerCommand('yutools.docker.removeContainer', removeContainer),
    vscode.commands.registerCommand('yutools.docker.removeImage', removeImage),
    vscode.commands.registerCommand('yutools.docker.buildImage', buildImage),
    vscode.commands.registerCommand('yutools.docker.pruneResources', pruneResources),
  );
}
