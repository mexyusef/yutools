import * as vscode from 'vscode';

interface CommandDefinition {
  id: string;
  handler: (...args: any[]) => any;
  title: string;
  description?: string;
  category?: string;
}

export class CommandRegistry {
  private commands: Map<string, CommandDefinition> = new Map();
  private disposables: vscode.Disposable[] = [];
  private categoryMap: Map<string, Set<string>> = new Map();

  constructor(private context: vscode.ExtensionContext) { }

  register(command: CommandDefinition): void {
    // Unregister existing command if it exists
    this.unregister(command.id);

    // Register new command
    this.commands.set(command.id, command);
    const disposable = vscode.commands.registerCommand(command.id, command.handler);
    this.disposables.push(disposable);
    this.context.subscriptions.push(disposable);

    // Update category mapping
    if (command.category) {
      if (!this.categoryMap.has(command.category)) {
        this.categoryMap.set(command.category, new Set());
      }
      this.categoryMap.get(command.category)?.add(command.id);
    }
  }

  unregister(commandId: string): void {
    const command = this.commands.get(commandId);
    if (command) {
      // Remove from category mapping
      if (command.category) {
        this.categoryMap.get(command.category)?.delete(commandId);
      }

      // Remove command registration
      this.commands.delete(commandId);
      const index = this.disposables.findIndex(d =>
        (d as any)._commandId === commandId ||
        (d as any).command === commandId
      );
      if (index !== -1) {
        this.disposables[index].dispose();
        this.disposables.splice(index, 1);
      }
    }
  }

  registerMany(commands: CommandDefinition[]): void {
    commands.forEach(cmd => this.register(cmd));
  }

  getCommandsByCategory(category: string): CommandDefinition[] {
    const commandIds = this.categoryMap.get(category) || new Set();
    return Array.from(commandIds)
      .map(id => this.commands.get(id))
      .filter((cmd): cmd is CommandDefinition => cmd !== undefined);
  }

  getAllCommands(): CommandDefinition[] {
    return Array.from(this.commands.values());
  }

  async showQuickPick(filter?: (cmd: CommandDefinition) => boolean): Promise<void> {
    const cmds = this.getAllCommands()
      .filter(filter || (() => true));

    const selection = await vscode.window.showQuickPick(
      cmds.map(cmd => ({
        label: cmd.title,
        description: cmd.description,
        detail: cmd.category,
        command: cmd.id
      }))
    );

    if (selection) {
      await vscode.commands.executeCommand(selection.command);
    }
  }

  dispose(): void {
    this.disposables.forEach(d => d.dispose());
    this.commands.clear();
    this.categoryMap.clear();
  }
}

// 1. Basic runtime command addition
export function register_command_registry_commands(context: vscode.ExtensionContext) {
  const registry = new CommandRegistry(context);

  // Initial commands
  registry.registerMany([
    {
      id: 'extension.baseCommand',
      title: 'Base Command',
      handler: () => console.log('Base command executed'),
      category: 'Basic'
    }
  ]);

  // Add commands dynamically based on some condition
  if (vscode.workspace.workspaceFolders?.length) {
    registry.register({
      id: 'extension.workspaceCommand',
      title: 'Workspace Command',
      handler: () => console.log('Workspace command executed'),
      category: 'Workspace'
    });
  }

  // 2. Add commands based on configuration
  const config = vscode.workspace.getConfiguration('yutools');
  const enabledFeatures = config.get<string[]>('enabledFeatures', []);

  enabledFeatures.forEach(feature => {
    registry.register({
      id: `extension.${feature}`,
      title: `${feature} Command`,
      handler: () => console.log(`${feature} executed`),
      category: 'Features'
    });
  });

  // 3. Add commands in response to events
  vscode.workspace.onDidChangeConfiguration(e => {
    if (e.affectsConfiguration('myExtension.enabledFeatures')) {
      // Remove old feature commands
      registry.getCommandsByCategory('Features')
        .forEach(cmd => registry.unregister(cmd.id));

      // Add new feature commands
      const newFeatures = vscode.workspace.getConfiguration('myExtension')
        .get<string[]>('enabledFeatures', []);

      newFeatures.forEach(feature => {
        registry.register({
          id: `extension.${feature}`,
          title: `${feature} Command`,
          handler: () => console.log(`${feature} executed`),
          category: 'Features'
        });
      });
    }
  });

  // 4. Add commands based on workspace content
  vscode.workspace.findFiles('**/package.json').then(files => {
    files.forEach(file => {
      registry.register({
        id: `extension.openPackageJson.${file.fsPath}`,
        title: `Open ${vscode.workspace.asRelativePath(file)}`,
        handler: () => vscode.window.showTextDocument(file),
        category: 'Project Files'
      });
    });
  });
}