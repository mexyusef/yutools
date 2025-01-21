import * as vscode from "vscode";
import { exec } from 'child_process';
import { spawn } from 'child_process';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';

const outputChannel = vscode.window.createOutputChannel("Yutools");

const minimizeWindow = vscode.commands.registerCommand('yutools.minimizeWindow', async () => {
	outputChannel.clear();
	outputChannel.show();
	outputChannel.appendLine("Command started");

	const script = `
			Write-Output "PowerShell script starting..."

			try {
					Add-Type @"
							using System;
							using System.Runtime.InteropServices;
							public class Win32 {
									[DllImport("user32.dll")]
									[return: MarshalAs(UnmanagedType.Bool)]
									public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);

									[DllImport("user32.dll")]
									public static extern bool EnumWindows(EnumWindowsProc enumProc, IntPtr lParam);

									[DllImport("user32.dll")]
									public static extern int GetWindowText(IntPtr hWnd, System.Text.StringBuilder lpString, int nMaxCount);

									public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);
							}
"@
					Write-Output "Win32 class added successfully"
			} catch {
					Write-Output "Error adding Win32 class: $_"
					exit 1
			}

			# Function to get window title
			function Get-WindowTitle([IntPtr]$hwnd) {
					$buff = New-Object System.Text.StringBuilder 256
					[Win32]::GetWindowText($hwnd, $buff, 256) | Out-Null
					return $buff.ToString()
			}

			# List of window handles and titles for debugging
			Write-Output "Searching for VSCode windows..."
			$vscodeWindows = @()

			$enumWindowsDelegate = {
					param([IntPtr]$hwnd, [IntPtr]$lparam)
					$title = Get-WindowTitle $hwnd
					if ($title -like "*Visual Studio Code*") {
							Write-Output "Found VSCode window: $title (Handle: $hwnd)"
							$vscodeWindows += @{handle=$hwnd; title=$title}
					}
					return $true
			}

			$delegateType = Get-Type ([Win32+EnumWindowsProc])
			$delegate = [System.Runtime.InteropServices.Marshal]::GetFunctionPointerForDelegate(
					[System.Delegate]::CreateDelegate($delegateType, $enumWindowsDelegate)
			)

			[Win32]::EnumWindows($delegate, [IntPtr]::Zero)

			if ($vscodeWindows.Count -gt 0) {
					Write-Output "Found VSCode windows: $($vscodeWindows.Count)"
					foreach ($window in $vscodeWindows) {
							Write-Output "Attempting to minimize window: $($window.title)"
							try {
									$result = [Win32]::ShowWindow($window.handle, 6)
									Write-Output "Minimize result: $result"
							} catch {
									Write-Output "Error during minimize: $_"
							}
					}
			} else {
					Write-Output "No VSCode windows found"
					exit 1
			}
	`;

	outputChannel.appendLine("Preparing to execute PowerShell");

	const tempDir = os.tmpdir();
	const scriptPath = path.join(tempDir, `vscode-minimizer-${Date.now()}.ps1`);

	try {
		fs.writeFileSync(scriptPath, script);
		outputChannel.appendLine(`Script saved to: ${scriptPath}`);

		outputChannel.appendLine("Launching PowerShell process");

		const ps = spawn('powershell.exe', [
			'-NoProfile',
			'-NonInteractive',
			'-ExecutionPolicy', 'Bypass',
			'-File', scriptPath
		]);

		ps.stdout.on('data', (data) => {
			outputChannel.appendLine(`stdout: ${data}`);
		});

		ps.stderr.on('data', (data) => {
			outputChannel.appendLine(`stderr: ${data}`);
			vscode.window.showErrorMessage(`Error: ${data}`);
		});

		ps.on('error', (error) => {
			outputChannel.appendLine(`Error: ${error.message}`);
			vscode.window.showErrorMessage(`Failed to start PowerShell: ${error.message}`);
		});

		ps.on('close', (code) => {
			outputChannel.appendLine(`PowerShell process exited with code ${code}`);
			try {
				fs.unlinkSync(scriptPath);
				outputChannel.appendLine("Cleaned up temporary script file");
			} catch (err) {
				outputChannel.appendLine(`Error cleaning up script file: ${err}`);
			}
		});
	} catch (error) {
		outputChannel.appendLine(`Failed to create/execute script: ${error}`);
		vscode.window.showErrorMessage(`Failed to create/execute script: ${error}`);
	}
});

const toggleMaximizedPanel = vscode.commands.registerCommand("yutools.toggleMaximizedPanel",
	async () => {
		const panelMaximized = vscode.workspace.getConfiguration("workbench").get<boolean>("panel.opensMaximized");
		await vscode.workspace.getConfiguration("workbench").update(
			"panel.opensMaximized",
			!panelMaximized,
			vscode.ConfigurationTarget.Global
		);
		// vscode.window.showInformationMessage(
		// 	`Panel maximized: ${!panelMaximized ? "Enabled" : "Disabled"}`
		// );
	}
);

// Command to toggle panel visibility
const togglePanelVisibility = vscode.commands.registerCommand("yutools.togglePanelVisibility",
	async () => {
		await vscode.commands.executeCommand("workbench.action.togglePanel");
	}
);


const togglePrimarySidebar = vscode.commands.registerCommand('yutools.togglePrimarySidebar', async () => {
	// console.log(`togglePrimarySidebar...`);
	// await vscode.commands.executeCommand('workbench.action.togglePrimarySidebarVisibility');
	// C:\ai\yuagent\src\vs\platform\codestoryAccount\browser\csAccount.ts
	await vscode.commands.executeCommand('workbench.action.toggleSidebarVisibility');
});

const toggleSecondarySidebar = vscode.commands.registerCommand('yutools.toggleSecondarySidebar', async () => {
	await vscode.commands.executeCommand('workbench.action.toggleAuxiliaryBar');
});

export function register_panel_commands(context: vscode.ExtensionContext) {
	// Register commands
	context.subscriptions.push(toggleMaximizedPanel, togglePanelVisibility);
	context.subscriptions.push(minimizeWindow);
	context.subscriptions.push(togglePrimarySidebar);
	context.subscriptions.push(toggleSecondarySidebar);
}
