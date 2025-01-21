// src/extension.ts

import * as vscode from 'vscode';
import { registerTriggerWorkflowCommand } from './triggerWorkflow';

export function activate(context: vscode.ExtensionContext) {
  // Register commands
  registerTriggerWorkflowCommand(context);
}
