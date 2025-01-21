import * as vscode from 'vscode';
import * as path from "path";
import { extension_name } from '../../constants';
import {
    createNewTerminal,
    // openWindowsCmdTerminal2,
    openWindowsCmdTerminal3,
} from '../terminal';

const register_terminal_at_cwd = vscode.commands.registerCommand(`${extension_name}.register_terminal_at_cwd`, () => {
    const handle = vscode.workspace.getConfiguration(extension_name);
    const lokasi = handle.get('currentWorkingDirectory') as string;
    createNewTerminal(
        lokasi, // name
        lokasi, // path
    );
});

const terminal_command_serve_llm = vscode.commands.registerCommand(`${extension_name}.terminal_command_serve_llm`, () => {
    // openWindowsCmdTerminal2(`python "C:\\Users\\usef\\work\\sidoarjo\\schnell\\app\\llmutils\\servers\\serve.py"`);
    openWindowsCmdTerminal3({
        perintah: `python "C:\\Users\\usef\\work\\sidoarjo\\schnell\\app\\llmutils\\servers\\serve.py"`,
        name: "LLM Server",
    });
});

// C:\ai\yuagent\extensions\yu-servers\yucomposer\server\main.py
const terminal_flask_aider_composer = vscode.commands.registerCommand(`${extension_name}.terminal_flask_aider_composer`, () => {
    // openWindowsCmdTerminal2(`python "C:\\Users\\usef\\work\\sidoarjo\\schnell\\app\\llmutils\\servers\\serve.py"`);
    openWindowsCmdTerminal3({
        perintah: `python "C:\\ai\\yuagent\\extensions\\yu-servers\\yucomposer\\server\\main.py"`,
        name: "Aider composer server",
        cwd: `C:\\ai\\yuagent\\extensions\\yu-servers\\yucomposer\\server`,
    });
});

const openTerminalInFileDirectory = vscode.commands.registerCommand(
    "yutools.openTerminalInFileDirectory",
    async () => {
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {
            vscode.window.showErrorMessage("No active editor found.");
            return;
        }

        const fileUri = activeEditor.document.uri;
        if (fileUri.scheme !== "file") {
            vscode.window.showErrorMessage("The active file is not a physical file.");
            return;
        }

        const filePath = fileUri.fsPath;
        const parentDirectory = path.dirname(filePath);

        const terminal = vscode.window.createTerminal({
            cwd: parentDirectory,
            name: `Terminal - ${path.basename(parentDirectory)}`
        });

        terminal.show();
    }
);
export function register_terminal_commands(context: vscode.ExtensionContext) {
    context.subscriptions.push(register_terminal_at_cwd);
    context.subscriptions.push(terminal_command_serve_llm);
    context.subscriptions.push(terminal_flask_aider_composer);
    context.subscriptions.push(openTerminalInFileDirectory);
}
