import * as vscode from 'vscode';
// import * as fs from 'fs';
// import * as path from 'path';
import { execFile } from 'child_process';
import { exec } from 'child_process';
import * as os from 'os';
import { main_file_templates } from '@/constants';
import { backup_file } from './backup_file';
import { createNewTerminal } from '../terminal';


export const command_selector_backup_main_file = (selected_app: string) => {
    let filePath = main_file_templates[selected_app]["file"];
    // if (!fs.existsSync(filePath)) {
    //     vscode.window.showErrorMessage(`File ${filePath} does not exist.`);
    //     return false;
    // }
    // const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '_').split('.')[0];
    // const backupPath = `${filePath}.${timestamp}.bak`;
    // const currentContent = fs.readFileSync(filePath, 'utf-8');
    // fs.writeFileSync(backupPath, currentContent);
    backup_file(filePath);
    // command_selector_run_bantuan(selected_app);
}


export const command_selector_run_bantuan = (selected_app: string) => {
    let main_file_to_add = main_file_templates[selected_app]["file"];
    const directoryPath = main_file_templates[selected_app]["root"];
    vscode.window.showInformationMessage(`Working in: ${directoryPath}`);

    const terminalName = "Bantuan";
    const shellPath = "aid.bat";
    const shellArgs = [main_file_to_add];
    const terminal = createNewTerminal(terminalName, directoryPath, shellPath, shellArgs);
    // Show a success message
    // vscode.window.showInformationMessage(`Jalankan bantuan di ${directoryPath}`);
    // export function fulled_explorer_context_directory_bantuan(context: vscode.ExtensionContext) {
    //     context.subscriptions.push(disposableBantuanAtDirectory);
}

export const command_selector_modify_app_file_then_run_bantuan = (selected_app: string) => {
    // let filePath = main_file_templates[selected_app]["file"];
    // if (!fs.existsSync(filePath)) {
    //     vscode.window.showErrorMessage(`File ${filePath} does not exist.`);
    //     return false;
    // }
    // const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '_').split('.')[0];
    // const backupPath = `${filePath}.${timestamp}.bak`;
    // const currentContent = fs.readFileSync(filePath, 'utf-8');
    // fs.writeFileSync(backupPath, currentContent);
    command_selector_backup_main_file(selected_app);
    command_selector_run_bantuan(selected_app);
}

export const command_selector_open_app_in_fulled_gagal = (selected_app: string) => {
    const directoryPath = main_file_templates[selected_app]["root"];
    const command = "fulled";
    // Execute the command with the directoryPath argument
    execFile(command, [directoryPath], (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing command: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
}

export const command_selector_open_app_in_fulled = async (selected_app: string) => {
    // const directoryPath = main_file_templates[selected_app]["root"];
    const filePath = main_file_templates[selected_app]["file"];
    try {
        // Open the file or folder in VS Code
        const document = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(document);
        console.log(`Opened: ${filePath}`);
    } catch (error: any) {
        console.error(`Error opening file in VS Code: ${error.message}`);
    }
};

export const command_selector_open_app_in_terminal = (selected_app: string) => {
    const directoryPath = main_file_templates[selected_app]["root"];
    const terminalName = selected_app;
    // const shellPath = "fulled";
    // const shellArgs = [directoryPath];
    const terminal = createNewTerminal(terminalName, directoryPath,
        // shellPath, shellArgs
    );
}

export const command_selector_open_app_in_folder = (selected_app: string) => {
    const directoryPath = main_file_templates[selected_app]["root"];
    let openCommand: string;
    // Determine the correct command based on the OS
    if (os.platform() === 'win32') {
        openCommand = `explorer "${directoryPath}"`;
    } else if (os.platform() === 'darwin') {
        openCommand = `open "${directoryPath}"`;
    } else if (os.platform() === 'linux') {
        openCommand = `xdg-open "${directoryPath}"`;
    } else {
        openCommand = `explorer "${directoryPath}"`;
    }
    // Execute the command to open the directory
    exec(openCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error opening directory: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        console.log(`Directory opened successfully: ${stdout}`);
    });
};


export function set_config_workdir_and_update_statusbar() { }
