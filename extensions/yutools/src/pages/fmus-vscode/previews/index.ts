import * as vscode from 'vscode';
import { registerLivePreviewsHTML } from './html';
import { registerLivePreviewsGradio } from './gradio';
import { registerLivePreviewsNextjs } from './nextjs';
import { registerLivePreviewsNextjsJavascript } from './reactjs_javascript';
import { registerLivePreviewsReactjs } from './reactjs';
import { registerLivePreviewsStreamlit } from './streamlit';
import { registerLivePreviewsSvelte } from './sveltejs';
import { registerLivePreviewsVuejs } from './vuejs';
import { registerLivePreviewsVuejsJavascript } from './vuejs_javscript';
import { registerPreviewCommands } from '../new-commands/previewCommands';
import { runTkinterAppFirefoxer } from '../new-commands/runTkinterAppFirefoxer';
import { runTkinterAppFiles2Prompt } from '../new-commands/runTkinterAppFiles2Prompt';

export function register_previews_commands(context: vscode.ExtensionContext) {
	// registerLivePreviewsHTML(context);
	// registerLivePreviewsGradio(context);
	// registerLivePreviewsNextjs(context);
	// registerLivePreviewsNextjsJavascript(context);
	// registerLivePreviewsReactjs(context);
	// registerLivePreviewsStreamlit(context);
	// registerLivePreviewsSvelte(context);
	// registerLivePreviewsVuejs(context);
	// registerLivePreviewsVuejsJavascript(context);
	registerPreviewCommands(context);
	context.subscriptions.push(
		runTkinterAppFirefoxer,
		runTkinterAppFiles2Prompt,
	);
}
