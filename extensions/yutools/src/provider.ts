import * as vscode from 'vscode';
import {
  allowed_urls,
  main_script_relative,
  main_style_relative,
  main_webview_id,
} from './constants';
import { getNonce } from './utils';

export class ContentPanelProvider implements vscode.WebviewViewProvider {

	public static readonly viewId = main_webview_id;

	public webview: Promise<vscode.Webview>;
	private readonly _extensionUri: vscode.Uri;
	private _res: (c: vscode.Webview) => void;


	constructor(context: vscode.ExtensionContext) {
		this._extensionUri = context.extensionUri;
		let temp_res: typeof this._res | undefined = undefined;
		this.webview = new Promise((res, rej) => { temp_res = res; });
		if (!temp_res) {
			throw new Error('content provider: resolver was undefined');
		}
		this._res = temp_res;
	}

	resolveWebviewView(
		webviewView: vscode.WebviewView,
		context: vscode.WebviewViewResolveContext,
		token: vscode.CancellationToken,
	) {
		const webview = webviewView.webview;
		webview.options = {
			enableScripts: true,
			enableForms: true,
			// sandbox: ['allow-scripts', 'allow-forms', 'allow-modals', 'allow-same-origin'],
			localResourceRoots: [
				this._extensionUri
			]
		};

		const rootPath = this._extensionUri;
		let scriptUri;
		const rootUri = webview.asWebviewUri(vscode.Uri.joinPath(rootPath));
		const stylesUri = webview.asWebviewUri(vscode.Uri.joinPath(rootPath, main_style_relative));
		if (webviewView.viewType === main_webview_id) {
			scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(rootPath, main_script_relative));
		}

		const nonce = getNonce();

		webview.html = `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Webview</title>
        <meta http-equiv="Content-Security-Policy" content="default-src 'self'; connect-src ${allowed_urls.join(' ')}; img-src vscode-resource: https:; script-src 'nonce-${nonce}';style-src vscode-resource: 'unsafe-inline' http: https: data:;">
        <base href="${rootUri}/">
        <link href="${stylesUri}" rel="stylesheet">
      </head>
      <body>
        <div id="root"></div>
		    <script nonce="${nonce}" src="${scriptUri}"></script>
      </body>
      </html>`;

		this._res(webview);
	}

}
