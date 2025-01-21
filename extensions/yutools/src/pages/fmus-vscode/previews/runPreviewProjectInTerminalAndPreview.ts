import { previewProjectOnWebviewBesideOrBrowser } from './previewProjectOnWebviewBeside';
import { runPreviewProjectInTerminal } from './runPreviewProjectInTerminal';

export async function runPreviewProjectInTerminalAndPreview(framework: string, open_in_browser: boolean = false) {
	await runPreviewProjectInTerminal(framework);
	previewProjectOnWebviewBesideOrBrowser(framework, open_in_browser);
}
