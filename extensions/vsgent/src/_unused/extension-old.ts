import * as vscode from 'vscode';
import { VsGentProvider } from './providers/vsgent-provider';

let outputChannel: vscode.OutputChannel;
export function activate(context: vscode.ExtensionContext) {

	outputChannel = vscode.window.createOutputChannel("VSGENT");
	context.subscriptions.push(outputChannel);
	outputChannel.appendLine("VSGENT extension activated");

	const sidebarProvider = new VsGentProvider(context, outputChannel);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(VsGentProvider.viewType, sidebarProvider, {
			webviewOptions: { retainContextWhenHidden: true },
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand("vsgent.plusButtonTapped", async () => {
			console.log(`vsgent.plusButtonTapped command dipencet`);
			outputChannel.appendLine("Plus button tapped");
			await sidebarProvider.clearTask();
			await sidebarProvider.postStateToWebview();
			await sidebarProvider.postMessageToWebview({ type: "action", action: "plusButtonTapped" });
		})
	);

	const openVsGentInNewTab = () => {
		console.log(`vsgent.popoutButtonTapped command dipencet`);
		outputChannel.appendLine("Opening VSGENT in new tab");
		// (this example uses webviewProvider activation event which is necessary to deserialize cached webview, but since we use retainContextWhenHidden, we don't need to use that event)
		// https://github.com/microsoft/vscode-extension-samples/blob/main/webview-sample/src/extension.ts
		const tabProvider = new VsGentProvider(context, outputChannel);
		//const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined
		const lastCol = Math.max(...vscode.window.visibleTextEditors.map((editor) => editor.viewColumn || 0));
		const targetCol = Math.max(lastCol + 1, 1);
		const panel = vscode.window.createWebviewPanel(VsGentProvider.viewType, "VSGENT", targetCol, {
			enableScripts: true,
			retainContextWhenHidden: true,
			localResourceRoots: [context.extensionUri],
		});
		// TODO: use better svg icon with light and dark variants (see https://stackoverflow.com/questions/58365687/vscode-extension-iconpath)
		panel.iconPath = vscode.Uri.joinPath(context.extensionUri, "icon.png");
		tabProvider.resolveWebviewView(panel);

		// Lock the editor group so clicking on files doesn't open them over the panel
		new Promise((resolve) => setTimeout(resolve, 100)).then(() => {
			vscode.commands.executeCommand("workbench.action.lockEditorGroup");
		});
	};

	context.subscriptions.push(vscode.commands.registerCommand("vsgent.popoutButtonTapped", openVsGentInNewTab));
	context.subscriptions.push(vscode.commands.registerCommand("vsgent.openInNewTab", openVsGentInNewTab));

	context.subscriptions.push(
		vscode.commands.registerCommand("vsgent.settingsButtonTapped", () => {
			console.log(`vsgent.settingsButtonTapped command dipencet`);
			//const message = "vsgent.settingsButtonTapped!"
			//vscode.window.showInformationMessage(message)
			sidebarProvider.postMessageToWebview({ type: "action", action: "settingsButtonTapped" });
		})
	);

}

// This method is called when your extension is deactivated
export function deactivate() { }
