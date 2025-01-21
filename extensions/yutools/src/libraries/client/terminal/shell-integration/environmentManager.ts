import * as vscode from 'vscode';
import * as path from "path";
import { ValidationResult } from './dependencyAnalyzer';

export class EnvironmentManager {
  private readonly ENV_BACKUP_DIR = '.env-backups';
  private readonly REQUIRED_VARS = ['API_KEY', 'DATABASE_URL', 'NODE_ENV'];

  async backupEnvFile(workspaceRoot: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(workspaceRoot, this.ENV_BACKUP_DIR, `.env.${timestamp}`);

    const envContent = await vscode.workspace.fs.readFile(
      vscode.Uri.file(path.join(workspaceRoot, '.env'))
    );

    await vscode.workspace.fs.writeFile(
      vscode.Uri.file(backupPath),
      envContent
    );
  }

  async validateEnv(workspaceRoot: string): Promise<ValidationResult> {
    const envContent = await vscode.workspace.fs.readFile(
      vscode.Uri.file(path.join(workspaceRoot, '.env'))
    );

    const envVars = this.parseEnvFile(envContent.toString());
    const missing = this.REQUIRED_VARS.filter(v => !envVars.has(v));

    return {
      isValid: missing.length === 0,
      missingVars: missing
    };
  }

  private parseEnvFile(content: string): Map<string, string> {
    const vars = new Map<string, string>();
    const lines = content.split('\n');

    for (const line of lines) {
      const [key, value] = line.split('=').map(s => s.trim());
      if (key && value) {
        vars.set(key, value);
      }
    }

    return vars;
  }
}
