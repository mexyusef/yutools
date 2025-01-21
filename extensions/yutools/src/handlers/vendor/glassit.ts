import { workspace, window, commands, ExtensionContext } from 'vscode';
import PowerShell from 'node-powershell';
import { extension_name } from '../../constants';

export function register_glassit(context: ExtensionContext) {
	const config = () => workspace.getConfiguration(extension_name);

	console.log('ctx', process.platform);

	const path = context.asAbsolutePath('./SetTransparency.cs');

	const ps = new PowerShell({
		// executionPolicy: 'RemoteSigned',
		// C:\ai\yuagent\extensions\yutools\node_modules\@types\node-powershell\index.d.ts
		executionPolicy: 'Bypass',
		noProfile: true,
	});

	context.subscriptions.push(ps);
	ps.addCommand('[Console]::OutputEncoding = [Text.Encoding]::UTF8');
	ps.addCommand(`Add-Type -Path '${path}'`);

	function setAlpha(alpha: number): void {
		if (alpha < 1) {
			alpha = 1;
		} else if (alpha > 255) {
			alpha = 255;
		}

		ps.addCommand(`[GlassIt.SetTransParency]::SetTransParency(${process.pid}, ${alpha})`);
		ps.invoke()
			.then((res) => {
				// console.log(res);
				console.log(`alpha ${alpha}`);
				config().update('glassit_alpha', alpha, true);
			})
			.catch((err) => {
				console.error(err);
				window.showErrorMessage(`Yutools GlassIt Error: ${err}`);
			});
	}

	const alpha = config().get<number>('glassit_alpha')!;
	setAlpha(alpha);

	context.subscriptions.push(
		commands.registerCommand('yutools.glassit_increase', () => {
			const alpha = config().get<number>('glassit_alpha')! - config().get<number>('glassit_step')!;
			setAlpha(alpha);
		})
	);

	context.subscriptions.push(
		commands.registerCommand('yutools.glassit_decrease', () => {
			const alpha = config().get<number>('glassit_alpha')! + config().get<number>('glassit_step')!;
			setAlpha(alpha);
		})
	);

	context.subscriptions.push(
		commands.registerCommand('yutools.glassit_maximize', () => {
			setAlpha(1);
		})
	);

	context.subscriptions.push(
		commands.registerCommand('yutools.glassit_minimize', () => {
			setAlpha(255);
		})
	);

	context.subscriptions.push(
		commands.registerCommand('yutools.glassit_transparent', () => {
			setAlpha(100);
		})
	);

	// New command to toggle between setAlpha 20 and setAlpha 80
	context.subscriptions.push(
		commands.registerCommand('yutools.glassit_toggleAlpha20_80', () => {
			const currentAlpha = config().get<number>('glassit_alpha');
			if (currentAlpha === undefined || currentAlpha <= 200) {
				setAlpha(240);
			} else {
				setAlpha(200);
			}
		})
	);

	context.subscriptions.push(
		commands.registerCommand('yutools.glassit_toggleAlpha100', () => {
			const currentAlpha = config().get<number>('glassit_alpha');
			if (currentAlpha === undefined || currentAlpha !== 255) {
				setAlpha(255);
			} else {
				setAlpha(200);
			}
		})
	);

}

	// if (process.platform == 'linux') {
	// 	const cp = require('child_process');
	// 	const codeWindowIds = [];
	// 	if (config().get('force_sway') === false) {
	// 		// Checking the weather xprop has installed
	// 		try {
	// 			cp.spawnSync('which xprop').toString();
	// 		} catch (error) {
	// 			console.error(`GlassIt Error: Please install xprop package to use GlassIt.`);
	// 			return;
	// 		}
	// 		// Retrieve the process name for the current VS Code instance (Solution for using forks of VS Code)
	// 		const process_name = process.execPath.substring(process.execPath.lastIndexOf('/') + 1);
	// 		// Retrieving the process ids of VS code
	// 		const processIds = cp.execSync(`pgrep ${process_name}`).toString().split('\n');
	// 		processIds.pop();
	// 		// Retrieving all window ids
	// 		const allWindowIdsOutput = cp.execSync(
	// 			`xprop -root | grep '_NET_CLIENT_LIST(WINDOW)'`
	// 		).toString();
	// 		const allWindowIds = allWindowIdsOutput.match(/0x[\da-f]+/ig);
	// 		for (const windowId of allWindowIds) {
	// 			// Checking the weather the window has a associated process
	// 			const hasProcessId = cp.execSync(`xprop -id ${windowId} _NET_WM_PID`).toString();
	// 			if (!(hasProcessId.search('not found') + 1)) {
	// 				// Extract process id from the result
	// 				const winProcessId = hasProcessId.replace(/([a-zA-Z_\(\)\s\=])/g, '');
	// 				if (processIds.includes(winProcessId)) {
	// 					codeWindowIds.push(windowId);
	// 				}
	// 			}
	// 		}
	// 	}
	// 	function setAlpha(alpha) {
	// 		if (alpha < 1) {
	// 			alpha = 1;
	// 		} else if (alpha > 255) {
	// 			alpha = 255;
	// 		}
	// 		if (config().get('force_sway') === true){
	// 			console.log(`In force_sway mode...`);
	// 			cp.exec(`swaymsg opacity ${(alpha / 255).toFixed(2)}`, function (error, stdout, stderr) {
	// 				if (error) {
	// 					console.error(`GlassIt error: ${error}`);
	// 					return;
	// 				}
	// 				console.log(stdout.toString());
	// 				console.log(`GlassIt: set alpha ${alpha}`);
	// 				config().update('alpha', alpha, true);
	// 			})
	// 		} else {
	// 			for (const codeWindowId of codeWindowIds) {
	// 				cp.exec(`xprop  -id ${codeWindowId} -f _NET_WM_WINDOW_OPACITY 32c -set _NET_WM_WINDOW_OPACITY $(printf 0x%x $((0xffffffff * ${alpha} / 255)))`, function (error, stdout, stderr) {
	// 					if (error) {
	// 						console.error(`GlassIt error: ${error}`);
	// 						return;
	// 					}
	// 					console.log(stdout.toString());
	// 					console.log(`GlassIt: set alpha ${alpha}`);
	// 					config().update('alpha', alpha, true);
	// 				});
	// 			}
	// 		}
	// 	}
	// }
