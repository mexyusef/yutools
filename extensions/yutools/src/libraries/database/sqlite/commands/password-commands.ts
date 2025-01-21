import * as vscode from 'vscode';
import { PasswordManager } from '../zendb';
import { addPasswordCommand } from './addPassword';
import { listPasswordsCommand } from './listPasswords';
import { updatePasswordCommand } from './updatePassword';
import { deletePasswordCommand } from './deletePassword';

export function register_db_sqlite_password_commands(context: vscode.ExtensionContext) {
  // C:\Users\usef\AppData\Roaming\Code\User\globalStorage\<publisher>.<extension-name>\
  // c:\Users\usef\AppData\Roaming\code-oss-dev\User\globalStorage\mexyusef.yutools\quicksnips.sqlite
  // c:\Users\usef\AppData\Roaming\code-oss-dev\User\globalStorage\mexyusef.yutools\password-manager.sqlite
  const lokasi = context.globalStorageUri.fsPath;
  console.log(`aktivasi password manager di ${lokasi}.`);
  const passwordManager = new PasswordManager(lokasi + '/password-manager.sqlite');

  context.subscriptions.push(
    vscode.commands.registerCommand('yutools.db.zendb.addPassword', addPasswordCommand(passwordManager)),
    vscode.commands.registerCommand('yutools.db.zendb.listPasswords', listPasswordsCommand(passwordManager)),
    vscode.commands.registerCommand('yutools.db.zendb.updatePassword', updatePasswordCommand(passwordManager)),
    vscode.commands.registerCommand('yutools.db.zendb.deletePassword', deletePasswordCommand(passwordManager)),
  );
}
