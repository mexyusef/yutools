import * as vscode from 'vscode';
import { TerminalManager } from './terminalManager';
import { MetricsCollector } from './metricsCollector';

export class TerminalHandlers {
  private metrics: MetricsCollector;
  private terminalManager: TerminalManager;
  private statusBarItems: Map<string, vscode.StatusBarItem>;

  constructor() {
    this.metrics = new MetricsCollector();
    this.terminalManager = new TerminalManager();
    this.statusBarItems = new Map();
    this.initializeStatusBars();
  }

  private initializeStatusBars(): void {
    const memoryStatus = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    memoryStatus.text = "Memory: --";
    memoryStatus.show();
    this.statusBarItems.set('memory', memoryStatus);

    const buildStatus = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    buildStatus.text = "Build: --";
    buildStatus.show();
    this.statusBarItems.set('build', buildStatus);
  }

  handleNodeProcesses = async (event: vscode.TerminalShellExecutionEvent): Promise<void> => {
    if (event.execution.commandLine.includes('node') || event.execution.commandLine.includes('npm')) {
      const memoryUsage = await this.metrics.getProcessMemoryUsage();
      this.statusBarItems.get('memory')!.text = `Memory: ${memoryUsage}MB`;

      if (memoryUsage > 1000) {
        vscode.window.showWarningMessage('High memory usage detected in Node process');
      }
    }
  }

  handleLongRunningCommands = (event: vscode.TerminalShellExecutionEvent): void => {
    const startTime = Date.now();
    const command = event.execution.commandLine;

    setTimeout(() => {
      if (!event.exitCode) {  // Command still running
        vscode.window.showInformationMessage(
          `Command "${command}" has been running for over 5 minutes`,
          'Show Terminal',
          'Kill Process'
        ).then(selection => {
          if (selection === 'Show Terminal') {
            event.terminal.show();
          } else if (selection === 'Kill Process') {
            this.terminalManager.killProcess(event.terminal);
          }
        });
      }
    }, 5 * 60 * 1000);  // 5 minutes
  }

  handlePackageInstalls = (event: vscode.TerminalShellExecutionEvent): void => {
    if (event.execution.commandLine.match(/(npm install|yarn add|pnpm add)/)) {
      const packageJson = this.findPackageJson();
      if (packageJson) {
        this.backupPackageJson(packageJson);
      }
    }
  }

  handleDatabaseCommands = async (event: vscode.TerminalShellExecutionEvent): Promise<void> => {
    if (event.execution.commandLine.match(/(psql|mysql|mongosh|redis-cli)/)) {
      const timestamp = new Date().toISOString();
      const logFile = `${timestamp}_db_commands.log`;

      await vscode.workspace.fs.writeFile(
        vscode.Uri.file(logFile),
        Buffer.from(`Command: ${event.execution.commandLine}\nTimestamp: ${timestamp}\n`)
      );
    }
  }

  handleGitOperations = async (event: vscode.TerminalShellExecutionEvent): Promise<void> => {
    if (event.execution.commandLine.startsWith('git push')) {
      const branchName = await this.getCurrentBranch();
      const isProtected = await this.isProtectedBranch(branchName);

      if (isProtected) {
        const proceed = await vscode.window.showWarningMessage(
          `You're pushing to protected branch ${branchName}. Proceed?`,
          'Yes', 'No'
        );

        if (proceed === 'No') {
          event.terminal.sendText('\x03');  // Send SIGINT
        }
      }
    }
  }

  private async getCurrentBranch(): Promise<string> {
    // Implementation details...
    return 'main';
  }

  private async isProtectedBranch(branch: string): Promise<boolean> {
    const protectedBranches = ['main', 'master', 'production'];
    return protectedBranches.includes(branch);
  }

  private findPackageJson(): vscode.Uri | undefined {
    // Implementation details...
    return undefined;
  }

  private async backupPackageJson(uri: vscode.Uri): Promise<void> {
    // Implementation details...
  }

  dispose(): void {
    this.statusBarItems.forEach(item => item.dispose());
  }
}


// // Add to TerminalHandlers class
// export class TerminalHandlers {
//   private webviews: Map<string, BaseWebview> = new Map();
//   private patternAnalyzer: CodePatternAnalyzer;
//   private migrationHelper: PackageMigration;

//   constructor() {
//       // ... existing initialization ...
//       this.patternAnalyzer = new CodePatternAnalyzer();
//       this.migrationHelper = new PackageMigration();
//   }

//   private showSecurityDetailsWebview(issues: SecurityIssue[]): void {
//       const webview = new SecurityDetailsWebview(this.context.extensionUri, issues);
//       this.webviews.set('security', webview);
//   }

//   // ... implement other webview methods similarly ...

//   async analyzeMigrationPath(): Promise<void> {
//       const packageJson = await this.readPackageJson();
//       if (packageJson) {
//           const plan = await this.migrationHelper.analyzeMigrationPath(packageJson);
//           this.showMigrationPlanWebview(plan);
//       }
//   }
// }
// extension.ts
export function activate(context: vscode.ExtensionContext) {
  const handlers = new TerminalHandlers();

  const terminalExecSubscription = vscode.window.onDidStartTerminalShellExecution(event => {
    handlers.handleNodeProcesses(event);
    handlers.handleLongRunningCommands(event);
    handlers.handlePackageInstalls(event);
    handlers.handleDatabaseCommands(event);
    handlers.handleGitOperations(event);
  });

  context.subscriptions.push(
    terminalExecSubscription,
    handlers
  );
}