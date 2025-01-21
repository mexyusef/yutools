import * as vscode from 'vscode';
import { readAccounts } from './accounts';

export async function getAccountFromQuickPick(accountsFilePath: string): Promise<{ username: string; password: string } | undefined> {
  const accounts = readAccounts(accountsFilePath);
  if (accounts.length === 0) {
    vscode.window.showErrorMessage(`No accounts found in ${accountsFilePath}.`);
    return undefined;
  }

  const selectedAccount = await vscode.window.showQuickPick(
    accounts.map((account) => ({
      label: account.name,
      description: account.username,
      detail: account.password, // Optional: Show password in details
      account,
    })),
    {
      placeHolder: 'Select an account',
    }
  );

  if (!selectedAccount) {
    vscode.window.showWarningMessage('No account selected.');
    return undefined;
  }

  return {
    username: selectedAccount.account.username,
    password: selectedAccount.account.password,
  };
}