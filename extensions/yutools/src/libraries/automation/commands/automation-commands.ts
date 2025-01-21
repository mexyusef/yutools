import * as vscode from 'vscode';
import { searchGoogle } from './searchGoogle';
import { screenshotNYTimes } from './screenshotNYTimes';
import { loginLovable } from './loginLovable';
import { generateFullstackAppFromInput } from './fullstack/deepseekArtifacts';
import { loginDatabuttonAndOpenGmail } from './loginDatabuttonAndOpenGmail';
// import { stackblitzAndBoltAutomation } from './stackblitzAndBoltAutomation';
import { stackblitzAndBoltAutomationTry2 } from './stackblitzAndBoltAutomationTry2';
import { generateRandomEnterpriseApp } from './fullstack/generateRandomEnterpriseApp';
import { typeRandomEnterpriseApp } from './lovable/typeRandomEnterpriseApp';
import { typeRandomEnterpriseApp as typeRandomEnterpriseAppBolt } from './bolt/typeRandomEnterpriseApp';
import { newAppRandomEnterpriseApp } from './databutton/newAppRandomEnterpriseApp';
import { handleSupabaseDropdown } from './lovable/handleSupabaseDropdown';
import { handleGitHubAuth } from './lovable/handleGitHubAuth';
import { registerGithubSignupCommand } from './github/signup';
import { registerRailwayLoginCommand } from './railway/loginSignup';

export function register_browser_automation_commands(context: vscode.ExtensionContext) {
  context.subscriptions.push(vscode.commands.registerCommand('yutools.browserAutomation.searchGoogle', searchGoogle));

  context.subscriptions.push(vscode.commands.registerCommand('yutools.browserAutomation.screenshotNYTimes', screenshotNYTimes));
  ////////////////////// deepseek artifacts
  context.subscriptions.push(vscode.commands.registerCommand('yutools.browserAutomation.generateFullstackApp', generateFullstackAppFromInput));

  context.subscriptions.push(vscode.commands.registerCommand('yutools.browserAutomation.dsArtifactRandomEnterpriseApp', generateRandomEnterpriseApp));
  ////////////////////// bolt
  context.subscriptions.push(vscode.commands.registerCommand('yutools.browserAutomation.stackblitzAndBoltAutomationTry2', stackblitzAndBoltAutomationTry2));

  context.subscriptions.push(vscode.commands.registerCommand('yutools.browserAutomation.bolt.randomEnterpriseApp', typeRandomEnterpriseAppBolt));
  ////////////////////// databutton
  context.subscriptions.push(vscode.commands.registerCommand('yutools.browserAutomation.databutton.newAppRandomEnterpriseApp', newAppRandomEnterpriseApp));

  context.subscriptions.push(vscode.commands.registerCommand('yutools.browserAutomation.loginDatabuttonAndOpenGmail', loginDatabuttonAndOpenGmail));
  ////////////////////// lovable
  context.subscriptions.push(vscode.commands.registerCommand('yutools.browserAutomation.loginLovable', loginLovable));

  context.subscriptions.push(vscode.commands.registerCommand('yutools.browserAutomation.lovable.randomEnterpriseApp', typeRandomEnterpriseApp));

  context.subscriptions.push(vscode.commands.registerCommand('yutools.browserAutomation.lovable.handleGitHubAuth', handleGitHubAuth));

  context.subscriptions.push(vscode.commands.registerCommand('yutools.browserAutomation.lovable.handleSupabaseDropdown', handleSupabaseDropdown));

  registerGithubSignupCommand(context);
  registerRailwayLoginCommand(context);
}
