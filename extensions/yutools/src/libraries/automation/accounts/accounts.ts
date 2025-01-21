import * as fs from 'fs';
// import * as path from 'path';
import * as vscode from 'vscode';
import { ACCOUNT_BOLT, ACCOUNT_DATABUTTON, ACCOUNT_GITHUB, ACCOUNT_LOVABLE } from './constants';

interface Account {
  name: string;
  username: string;
  password: string;
  projectUrl?: string;
  apiKey?: string;
}

export function readAccounts(accountsFilePath: string): Account[] {
  try {
    const data = fs.readFileSync(accountsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to read accounts file: ${error}`);
    return [];
  }
}

export function readGithub() {
  return readAccounts(ACCOUNT_GITHUB);
}

export function readBolt() {
  return readAccounts(ACCOUNT_BOLT);
}

export function readLovable() {
  return readAccounts(ACCOUNT_LOVABLE);
}

export function readDataButton() {
  return readAccounts(ACCOUNT_DATABUTTON);
}
