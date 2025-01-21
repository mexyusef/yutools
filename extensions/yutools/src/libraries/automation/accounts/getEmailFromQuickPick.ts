import * as vscode from 'vscode';
import { readAccounts } from './accounts';

export async function getEmailFromQuickPick(accountsFilePath: string): Promise<string | undefined> {
  const accounts = readAccounts(accountsFilePath);
  if (accounts.length === 0) {
    vscode.window.showErrorMessage(`No accounts found in ${accountsFilePath}.`);
    return undefined;
  }

  const selectedAccount = await vscode.window.showQuickPick(
    accounts.map((account) => ({
      label: account.name,
      description: account.username,
      account,
    })),
    {
      placeHolder: 'Select an email/username',
    }
  );

  if (!selectedAccount) {
    vscode.window.showWarningMessage('No email/username selected.');
    return undefined;
  }

  return selectedAccount.account.username;
}