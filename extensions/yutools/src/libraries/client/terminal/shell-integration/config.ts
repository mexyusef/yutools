import * as vscode from 'vscode';
import * as path from "path";
import * as fs from "fs";
import * as os from "os";
import { BuildAnalysis, DependencyReport, TestSuggestion, ValidationResult } from './dependencyAnalyzer';

export interface AnalyzerConfig {
  frameworks: {
    react: boolean;
    vue: boolean;
    angular: boolean;
    nest: boolean;
  };
  thresholds: {
    buildDuration: number;  // in seconds
    testCoverage: number;  // percentage
    cacheEfficiency: number;  // percentage
    memoryUsage: number;  // in MB
  };
  paths: {
    envBackup: string;
    testResults: string;
    buildCache: string;
  };
  notifications: {
    showBuildMetrics: boolean;
    showTestSuggestions: boolean;
    showSecurityAlerts: boolean;
  };
}

export class ConfigManager {
  private static instance: ConfigManager;
  private config: AnalyzerConfig;

  private constructor() {
    this.config = this.loadConfig();
  }

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  private loadConfig(): AnalyzerConfig {
    const config = vscode.workspace.getConfiguration('terminalAnalyzer');
    return {
      frameworks: {
        react: config.get('frameworks.react', true),
        vue: config.get('frameworks.vue', false),
        angular: config.get('frameworks.angular', false),
        nest: config.get('frameworks.nest', false)
      },
      thresholds: {
        buildDuration: config.get('thresholds.buildDuration', 120),
        testCoverage: config.get('thresholds.testCoverage', 80),
        cacheEfficiency: config.get('thresholds.cacheEfficiency', 70),
        memoryUsage: config.get('thresholds.memoryUsage', 1000)
      },
      paths: {
        envBackup: config.get('paths.envBackup', '.env-backups'),
        testResults: config.get('paths.testResults', 'test-results'),
        buildCache: config.get('paths.buildCache', 'node_modules/.cache')
      },
      notifications: {
        showBuildMetrics: config.get('notifications.showBuildMetrics', true),
        showTestSuggestions: config.get('notifications.showTestSuggestions', true),
        showSecurityAlerts: config.get('notifications.showSecurityAlerts', true)
      }
    };
  }

  getConfig(): AnalyzerConfig {
    return this.config;
  }

  async updateConfig(newConfig: Partial<AnalyzerConfig>): Promise<void> {
    const config = vscode.workspace.getConfiguration('terminalAnalyzer');
    for (const [key, value] of Object.entries(newConfig)) {
      await config.update(key, value, vscode.ConfigurationTarget.Workspace);
    }
    this.config = this.loadConfig();
  }
}

// Helper method implementations for TerminalHandlers
export class TerminalHandlers {
  // ... existing code ...

  private async readPackageJson(): Promise<any> {
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
    if (!workspaceRoot) {
      return null;
    }

    try {
      const packageJsonPath = path.join(workspaceRoot, 'package.json');
      const content = await vscode.workspace.fs.readFile(vscode.Uri.file(packageJsonPath));
      return JSON.parse(content.toString());
    } catch (error) {
      vscode.window.showErrorMessage('Failed to read package.json');
      return null;
    }
  }

  private showDependencyReport(report: DependencyReport): void {
    const config = ConfigManager.getInstance().getConfig();
    if (!config.notifications.showSecurityAlerts) return;

    if (report.securityIssues.length > 0) {
      vscode.window.showWarningMessage(
        `Found ${report.securityIssues.length} security issues`,
        'Show Details'
      ).then(selection => {
        if (selection === 'Show Details') {
          this.showSecurityDetailsWebview(report.securityIssues);
        }
      });
    }

    if (report.conflicts.length > 0) {
      vscode.window.showInformationMessage(
        `Found ${report.conflicts.length} version conflicts`,
        'Show Details'
      ).then(selection => {
        if (selection === 'Show Details') {
          this.showConflictsWebview(report.conflicts);
        }
      });
    }
  }

  private showEnvValidationWarning(validation: ValidationResult): void {
    if (validation.missingVars.length > 0) {
      vscode.window.showWarningMessage(
        `Missing required environment variables: ${validation.missingVars.join(', ')}`,
        'Create Variables'
      ).then(selection => {
        if (selection === 'Create Variables') {
          this.openEnvFileEditor(validation.missingVars);
        }
      });
    }
  }

  private showBuildAnalysis(analysis: BuildAnalysis): void {
    const config = ConfigManager.getInstance().getConfig();
    if (!config.notifications.showBuildMetrics) return;

    const statusBarItem = this.statusBarItems.get('build')!;
    statusBarItem.text = `$(clock) Build: ${analysis.averageDuration.toFixed(1)}s`;

    if (analysis.suggestions.length > 0) {
      vscode.window.showInformationMessage(
        'Build optimization suggestions available',
        'Show Suggestions'
      ).then(selection => {
        if (selection === 'Show Suggestions') {
          this.showBuildSuggestionsWebview(analysis);
        }
      });
    }
  }

  private showTestSuggestions(suggestions: TestSuggestion[]): void {
    const config = ConfigManager.getInstance().getConfig();
    if (!config.notifications.showTestSuggestions) return;

    const highPriority = suggestions.filter(s => s.priority === 'high');
    if (highPriority.length > 0) {
      vscode.window.showWarningMessage(
        `${highPriority.length} high-priority tests suggested`,
        'Run Tests',
        'Show Details'
      ).then(selection => {
        if (selection === 'Run Tests') {
          this.runSuggestedTests(highPriority);
        } else if (selection === 'Show Details') {
          this.showTestSuggestionsWebview(suggestions);
        }
      });
    }
  }

  private async getChangedFiles(): Promise<string[]> {
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
    if (!workspaceRoot) {
      return [];
    }

    try {
      const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports;
      const git = gitExtension.getAPI(1);
      const repository = git.repositories[0];

      const changes = await repository.diffWithHEAD();
      return changes.map(change => change.uri.fsPath);
    } catch (error) {
      return [];
    }
  }

  // Webview helpers
  private showSecurityDetailsWebview(issues: any[]): void {
    // Implementation
  }

  private showConflictsWebview(conflicts: any[]): void {
    // Implementation
  }

  private showBuildSuggestionsWebview(analysis: BuildAnalysis): void {
    // Implementation
  }

  private showTestSuggestionsWebview(suggestions: TestSuggestion[]): void {
    // Implementation
  }

  private async openEnvFileEditor(missingVars: string[]): Promise<void> {
    // Implementation
  }

  private async runSuggestedTests(suggestions: TestSuggestion[]): Promise<void> {
    // Implementation
  }
}

// Framework-specific analyzers
// reactAnalyzer.ts
export class ReactAnalyzer {
  private config = ConfigManager.getInstance().getConfig();

  async analyzeComponent(filePath: string): Promise<ComponentAnalysis> {
    const content = await this.readFile(filePath);
    return {
      hooks: this.analyzeHooks(content),
      props: this.analyzeProps(content),
      performance: this.analyzePerformance(content),
      suggestions: this.generateSuggestions(content)
    };
  }

  private analyzeHooks(content: string): HookAnalysis[] {
    const hookPattern = /use[A-Z]\w+/g;
    const matches = content.match(hookPattern) || [];
    return matches.map(hook => ({
      name: hook,
      dependencies: this.findHookDependencies(content, hook),
      issues: this.findHookIssues(content, hook)
    }));
  }

  private analyzeProps(content: string): PropAnalysis {
    // Implementation
    return { count: 0, required: [], optional: [] };
  }

  private analyzePerformance(content: string): PerformanceAnalysis {
    // Implementation
    return { reRenderRisk: 'low', memoizationSuggestions: [] };
  }

  private generateSuggestions(content: string): string[] {
    // Implementation
    return [];
  }

  private async readFile(filePath: string): Promise<string> {
    const content = await vscode.workspace.fs.readFile(vscode.Uri.file(filePath));
    return content.toString();
  }

  private findHookDependencies(content: string, hook: string): string[] {
    // Implementation
    return [];
  }

  private findHookIssues(content: string, hook: string): string[] {
    // Implementation
    return [];
  }
}

// Types for framework analyzers
interface ComponentAnalysis {
  hooks: HookAnalysis[];
  props: PropAnalysis;
  performance: PerformanceAnalysis;
  suggestions: string[];
}

interface HookAnalysis {
  name: string;
  dependencies: string[];
  issues: string[];
}

interface PropAnalysis {
  count: number;
  required: string[];
  optional: string[];
}

interface PerformanceAnalysis {
  reRenderRisk: 'low' | 'medium' | 'high';
  memoizationSuggestions: string[];
}
