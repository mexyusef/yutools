// hayya https://chatgpt.com/c/674bd4c9-818c-8000-b0f7-d771566f4454
import { Uri, Webview } from "vscode";
//import * as weather from "weather-js";
import * as vscode from "vscode";
import { VsGent } from "../vsgent";
import { VsGentMessage, ExtensionMessage } from "../shared/ExtensionMessage";
import { WebviewMessage } from "../shared/WebviewMessage";
import { Anthropic } from "@anthropic-ai/sdk";

export class VsGentProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = "vsgent.SidebarProvider"; // Updated identifier

    private disposables: vscode.Disposable[] = [];
    private view?: vscode.WebviewView | vscode.WebviewPanel;
    private providerInstanceIdentifier = Date.now();
    private vsGent?: VsGent; // Updated reference
    private latestAnnouncementId = "jul-25-2024";

    constructor(
        private readonly context: vscode.ExtensionContext,
        private readonly outputChannel: vscode.OutputChannel
    ) {
        this.outputChannel.appendLine("VsGentProvider instantiated");
    }

    async dispose() {
        this.outputChannel.appendLine("Disposing VsGentProvider...");
        await this.clearTask();
        this.outputChannel.appendLine("Cleared task");
        if (this.view && "dispose" in this.view) {
            this.view.dispose();
            this.outputChannel.appendLine("Disposed webview");
        }
        while (this.disposables.length) {
            const x = this.disposables.pop();
            if (x) {
                x.dispose();
            }
        }
        this.outputChannel.appendLine("Disposed all disposables");
    }

    resolveWebviewView(
        webviewView: vscode.WebviewView | vscode.WebviewPanel
    ): void | Thenable<void> {
        this.outputChannel.appendLine("Resolving webview view");
        this.view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this.context.extensionUri],
        };
        webviewView.webview.html = this.getHtmlContent(webviewView.webview);

        this.setWebviewMessageListener(webviewView.webview);

        if ("onDidChangeViewState" in webviewView) {
            webviewView.onDidChangeViewState(
                () => {
                    if (this.view?.visible) {
                        this.postMessageToWebview({ type: "action", action: "didBecomeVisible" });
                    }
                },
                null,
                this.disposables
            );
        } else if ("onDidChangeVisibility" in webviewView) {
            webviewView.onDidChangeVisibility(
                () => {
                    if (this.view?.visible) {
                        this.postMessageToWebview({ type: "action", action: "didBecomeVisible" });
                    }
                },
                null,
                this.disposables
            );
        }

        webviewView.onDidDispose(
            async () => {
                await this.dispose();
            },
            null,
            this.disposables
        );

        vscode.workspace.onDidChangeConfiguration(
            (e) => {
                if (e && e.affectsConfiguration("workbench.colorTheme")) {
                    this.postStateToWebview();
                }
            },
            null,
            this.disposables
        );

        this.clearTask();
        this.updateWorkspaceState("vsGentMessages", undefined);

        this.outputChannel.appendLine("Webview view resolved");
    }

    async tryToInitVsGentWithTask(task: string) {
        await this.clearTask();
        const [apiKey, maxRequestsPerTask] = await Promise.all([
            this.getSecret("apiKey") as Promise<string | undefined>,
            this.getGlobalState("maxRequestsPerTask") as Promise<number | undefined>,
        ]);
        if (this.view && apiKey) {
            this.vsGent = new VsGent(this, task, apiKey, maxRequestsPerTask);
        }
    }

    async postMessageToWebview(message: ExtensionMessage) {
        await this.view?.webview.postMessage(message);
    }

    private getHtmlContent(webview: vscode.Webview): string {
        const stylesUri = getUri(webview, this.context.extensionUri, [
            "ui",
            // "build",
            // "static",
            // "css",
            // "main.css",
            // C:\ai\aide\extensions\vsgent\ui\dist\assets\index-n_ryQ3BS.css
            "dist", "assets",
            // "index-n_ryQ3BS.css"
            "index.css",
        ]);
        const scriptUri = getUri(webview, this.context.extensionUri, [
            "ui",
            // "build",
            // "static",
            // "js",
            // "main.js",
            // C:\ai\aide\extensions\vsgent\ui\dist\assets\index-BJoHQsov.js
            "dist", "assets",
            // "index-BJoHQsov.js"
            "index.js",
        ]);
        const codiconsUri = getUri(webview, this.context.extensionUri, [
            "node_modules",
            "@vscode",
            "codicons",
            "dist",
            "codicon.css",
        ]);
        const nonce = getNonce();

        return /*html*/ `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
            <meta name="theme-color" content="#000000">
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; font-src ${webview.cspSource}; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
            <link rel="stylesheet" type="text/css" href="${stylesUri}">
			<link href="${codiconsUri}" rel="stylesheet" />
            <title>VsGent</title>
          </head>
          <body>
            <noscript>You need to enable JavaScript to run this app.</noscript>
            <div id="root"></div>
            <script nonce="${nonce}" src="${scriptUri}"></script>
          </body>
        </html>
      `;
    }

    private setWebviewMessageListener(webview: vscode.Webview) {
        webview.onDidReceiveMessage(
            async (message: WebviewMessage) => {
                switch (message.type) {
                    case "webviewDidLaunch":
                        await this.postStateToWebview();
                        break;
                    case "newTask":
                        await this.tryToInitVsGentWithTask(message.text!);
                        break;
                    case "apiKey":
                        // trigger dari C:\ai\aide\extensions\vsgent\ui\src\components\WelcomeView.tsx
                        await this.storeSecret("apiKey", message.text!);
                        this.vsGent?.updateApiKey(message.text!);
                        await this.postStateToWebview();
                        break;
                    case "maxRequestsPerTask":
                        let result: number | undefined = undefined;
                        if (message.text && message.text.trim()) {
                            const num = Number(message.text);
                            if (!isNaN(num)) {
                                result = num;
                            }
                        }
                        await this.updateGlobalState("maxRequestsPerTask", result);
                        this.vsGent?.updateMaxRequestsPerTask(result);
                        await this.postStateToWebview();
                        break;
                    case "askResponse":
                        this.vsGent?.handleWebviewAskResponse(message.askResponse!, message.text);
                        break;
                    case "clearTask":
                        await this.clearTask();
                        await this.postStateToWebview();
                        break;
                    case "didShowAnnouncement":
                        await this.updateGlobalState("lastShownAnnouncementId", this.latestAnnouncementId);
                        await this.postStateToWebview();
                        break;
                }
            },
            null,
            this.disposables
        );
    }

    async postStateToWebview() {
        const [apiKey, maxRequestsPerTask, vsGentMessages, lastShownAnnouncementId] = await Promise.all([
            this.getSecret("apiKey") as Promise<string | undefined>,
            this.getGlobalState("maxRequestsPerTask") as Promise<number | undefined>,
            this.getVsGentMessages(),
            this.getGlobalState("lastShownAnnouncementId") as Promise<string | undefined>,
        ]);

        this.postMessageToWebview({
            type: "state",
            state: {
                apiKey,
                maxRequestsPerTask,
                themeName: vscode.workspace.getConfiguration("workbench").get<string>("colorTheme"),
                vsGentMessages,
                shouldShowAnnouncement: lastShownAnnouncementId !== this.latestAnnouncementId,
            },
        });
    }

    async clearTask() {
        if (this.vsGent) {
            this.vsGent.abort = true;
            this.vsGent = undefined;
        }
        await this.setApiConversationHistory(undefined);
        await this.setVsGentMessages(undefined);
    }

    getVsGentMessagesStateKey() {
        return `vsGentMessages-${this.providerInstanceIdentifier}`;
    }

    getApiConversationHistoryStateKey() {
        return `apiConversationHistory-${this.providerInstanceIdentifier}`;
    }

    async getVsGentMessages(): Promise<VsGentMessage[]> {
        const messages = (await this.getGlobalState(this.getVsGentMessagesStateKey())) as VsGentMessage[];
        return messages || [];
    }


    async setVsGentMessages(messages: VsGentMessage[] | undefined) {
        await this.updateGlobalState(this.getVsGentMessagesStateKey(), messages);
    }

    async addVsGentMessage(message: VsGentMessage): Promise<VsGentMessage[]> {
        const messages = await this.getVsGentMessages();
        messages.push(message);
        await this.setVsGentMessages(messages);
        return messages;
    }

    async getApiConversationHistory(): Promise<Anthropic.MessageParam[]> {
        const history = (await this.getGlobalState(
            this.getApiConversationHistoryStateKey()
        )) as Anthropic.MessageParam[];
        return history || [];
    }

    async setApiConversationHistory(history: Anthropic.MessageParam[] | undefined) {
        await this.updateGlobalState(this.getApiConversationHistoryStateKey(), history);
    }

    async addMessageToApiConversationHistory(message: Anthropic.MessageParam): Promise<Anthropic.MessageParam[]> {
        const history = await this.getApiConversationHistory();
        history.push(message);
        await this.setApiConversationHistory(history);
        return history;
    }

    private async updateGlobalState(key: string, value: any) {
        await this.context.globalState.update(key, value);
    }

    private async getGlobalState(key: string) {
        return await this.context.globalState.get(key);
    }

    // workspace

    private async updateWorkspaceState(key: string, value: any) {
        await this.context.workspaceState.update(key, value);
    }

    private async getWorkspaceState(key: string) {
        return await this.context.workspaceState.get(key);
    }

    private async storeSecret(key: string, value: any) {
        await this.context.secrets.store(key, value);
    }

    private async getSecret(key: string) {
        return await this.context.secrets.get(key);
    }
}

export function getNonce() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

export function getUri(webview: Webview, extensionUri: Uri, pathList: string[]) {
    return webview.asWebviewUri(Uri.joinPath(extensionUri, ...pathList));
}
