import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
// import * as open from 'open';
import open from 'open'; // Correct way to import
import * as https from 'https';
import { execShellCommand } from '../execShellCommand';

const initDeployment = vscode.commands.registerCommand('yutools.koyeb.initDeployment', async () => {
	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (!workspaceFolders) {
		vscode.window.showErrorMessage('No workspace folder is open. Please open a folder to initialize deployment.');
		return;
	}

	const rootPath = workspaceFolders[0].uri.fsPath;
	const configFilePath = path.join(rootPath, 'koyeb-config.json');

	// Default configuration template
	const defaultConfig = {
		name: 'My App',
		type: 'fullstack', // Options: 'frontend', 'backend', 'fullstack'
		buildCommand: '',
		runCommand: '',
		env: {}
	};

	if (fs.existsSync(configFilePath)) {
		vscode.window.showWarningMessage('koyeb-config.json already exists.');
		return;
	}

	try {
		fs.writeFileSync(configFilePath, JSON.stringify(defaultConfig, null, 2), 'utf8');
		vscode.window.showInformationMessage('Initialized deployment configuration: koyeb-config.json');
	} catch (error: any) {
		vscode.window.showErrorMessage(`Failed to create koyeb-config.json: ${error.message}`);
	}
});

// // Register the command
// export function activate(context: vscode.ExtensionContext) {
// 	context.subscriptions.push(initDeployment);
// }

// export function deactivate() { }
const addEnvVariables = vscode.commands.registerCommand('yutools.koyeb.addEnvVariables', async () => {
	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (!workspaceFolders) {
		vscode.window.showErrorMessage('No workspace folder is open. Please open a folder to add environment variables.');
		return;
	}

	const rootPath = workspaceFolders[0].uri.fsPath;
	const configFilePath = path.join(rootPath, 'koyeb-config.json');

	if (!fs.existsSync(configFilePath)) {
		vscode.window.showErrorMessage('koyeb-config.json does not exist. Please run "Yutools: Init Deployment" first.');
		return;
	}

	// Read the current configuration
	let config;
	try {
		const configContent = fs.readFileSync(configFilePath, 'utf8');
		config = JSON.parse(configContent);
	} catch (error: any) {
		vscode.window.showErrorMessage(`Failed to read koyeb-config.json: ${error.message}`);
		return;
	}

	// Prompt user for key-value pairs
	const key = await vscode.window.showInputBox({ prompt: 'Enter the environment variable key (e.g., PORT)', placeHolder: 'Key' });
	if (!key) {
		vscode.window.showWarningMessage('Environment variable key is required.');
		return;
	}

	const value = await vscode.window.showInputBox({ prompt: `Enter the value for "${key}"`, placeHolder: 'Value' });
	if (value === undefined) {
		vscode.window.showWarningMessage('Environment variable value is required.');
		return;
	}

	// Update the configuration
	config.env = config.env || {};
	config.env[key] = value;

	try {
		fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2), 'utf8');
		vscode.window.showInformationMessage(`Added environment variable: ${key}=${value}`);
	} catch (error: any) {
		vscode.window.showErrorMessage(`Failed to update koyeb-config.json: ${error.message}`);
	}
});

// // Register the command
// export function activate(context: vscode.ExtensionContext) {
// 	context.subscriptions.push(initDeployment, addEnvVariables);
// }

// export function deactivate() {}


const installDependencies = vscode.commands.registerCommand('yutools.koyeb.installDependencies', async () => {
	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (!workspaceFolders) {
		vscode.window.showErrorMessage('No workspace folder is open. Please open a folder to install dependencies.');
		return;
	}

	const rootPath = workspaceFolders[0].uri.fsPath;

	// Prompt user to select a folder
	const subfolder = await vscode.window.showInputBox({
		prompt: 'Enter the subfolder to run "npm install" in (leave empty to use the root folder)',
		placeHolder: 'e.g., client, server'
	});

	const targetPath = subfolder ? path.join(rootPath, subfolder) : rootPath;

	if (!fs.existsSync(targetPath)) {
		vscode.window.showErrorMessage(`The specified folder does not exist: ${targetPath}`);
		return;
	}

	// Run npm install
	vscode.window.withProgress(
		{ location: vscode.ProgressLocation.Notification, title: `Installing dependencies in ${targetPath}...` },
		() =>
			new Promise<void>((resolve, reject) => {
				exec('npm install', { cwd: targetPath }, (error, stdout, stderr) => {
					if (error) {
						vscode.window.showErrorMessage(`Failed to install dependencies: ${stderr}`);
						return reject(error);
					}
					vscode.window.showInformationMessage(`Dependencies installed successfully in ${targetPath}`);
					resolve();
				});
			})
	);
});

// // Register the command
// export function activate(context: vscode.ExtensionContext) {
//     context.subscriptions.push(initDeployment, addEnvVariables, installDependencies);
// }

// export function deactivate() {}

const buildFrontend = vscode.commands.registerCommand('yutools.koyeb.buildFrontend', async () => {
	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (!workspaceFolders) {
		vscode.window.showErrorMessage('No workspace folder is open. Please open a folder to build the frontend.');
		return;
	}

	const rootPath = workspaceFolders[0].uri.fsPath;

	// Prompt user to specify the frontend folder
	const frontendFolder = await vscode.window.showInputBox({
		prompt: 'Enter the folder containing the React frontend (leave empty for the root folder)',
		placeHolder: 'e.g., client'
	});

	const targetPath = frontendFolder ? path.join(rootPath, frontendFolder) : rootPath;

	if (!fs.existsSync(targetPath)) {
		vscode.window.showErrorMessage(`The specified folder does not exist: ${targetPath}`);
		return;
	}

	// Check for package.json to confirm a Node.js project
	const packageJsonPath = path.join(targetPath, 'package.json');
	if (!fs.existsSync(packageJsonPath)) {
		vscode.window.showErrorMessage(`No package.json found in the specified folder: ${targetPath}`);
		return;
	}

	// Run npm run build
	vscode.window.withProgress(
		{ location: vscode.ProgressLocation.Notification, title: `Building frontend in ${targetPath}...` },
		() =>
			new Promise<void>((resolve, reject) => {
				exec('npm run build', { cwd: targetPath }, (error, stdout, stderr) => {
					if (error) {
						vscode.window.showErrorMessage(`Failed to build frontend: ${stderr}`);
						return reject(error);
					}
					vscode.window.showInformationMessage(`Frontend built successfully in ${targetPath}`);
					resolve();
				});
			})
	);
});

// // Register the command
// export function activate(context: vscode.ExtensionContext) {
// 	context.subscriptions.push(initDeployment, addEnvVariables, installDependencies, buildFrontend);
// }

// export function deactivate() {}
const buildFullstack = vscode.commands.registerCommand('yutools.koyeb.buildFullstack', async () => {
	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (!workspaceFolders) {
		vscode.window.showErrorMessage('No workspace folder is open. Please open a folder to build the fullstack application.');
		return;
	}

	const rootPath = workspaceFolders[0].uri.fsPath;

	// Step 1: Frontend build
	const frontendFolder = await vscode.window.showInputBox({
		prompt: 'Enter the folder containing the React frontend (leave empty for the root folder)',
		placeHolder: 'e.g., client'
	});

	const frontendPath = frontendFolder ? path.join(rootPath, frontendFolder) : rootPath;

	if (!fs.existsSync(frontendPath)) {
		vscode.window.showErrorMessage(`Frontend folder does not exist: ${frontendPath}`);
		return;
	}

	const frontendPackageJsonPath = path.join(frontendPath, 'package.json');
	if (!fs.existsSync(frontendPackageJsonPath)) {
		vscode.window.showErrorMessage(`No package.json found in the frontend folder: ${frontendPath}`);
		return;
	}

	vscode.window.showInformationMessage(`Building frontend in ${frontendPath}...`);
	const frontendBuildResult = await runCommand('npm run build', frontendPath);
	if (!frontendBuildResult.success) {
		vscode.window.showErrorMessage(`Frontend build failed: ${frontendBuildResult.error}`);
		return;
	}

	// Step 2: Backend preparation
	const backendFolder = await vscode.window.showInputBox({
		prompt: 'Enter the folder containing the Express backend (leave empty for the root folder)',
		placeHolder: 'e.g., server'
	});

	const backendPath = backendFolder ? path.join(rootPath, backendFolder) : rootPath;

	if (!fs.existsSync(backendPath)) {
		vscode.window.showErrorMessage(`Backend folder does not exist: ${backendPath}`);
		return;
	}

	const backendPackageJsonPath = path.join(backendPath, 'package.json');
	if (!fs.existsSync(backendPackageJsonPath)) {
		vscode.window.showErrorMessage(`No package.json found in the backend folder: ${backendPath}`);
		return;
	}

	vscode.window.showInformationMessage(`Preparing backend in ${backendPath}...`);
	const backendBuildResult = await runCommand('npm run build', backendPath);
	if (!backendBuildResult.success) {
		vscode.window.showErrorMessage(`Backend build failed: ${backendBuildResult.error}`);
		return;
	}

	vscode.window.showInformationMessage(`Fullstack application built successfully.`);
});

// Helper function to run a command
async function runCommand(command: string, cwd: string): Promise<{ success: boolean; error?: string }> {
	return new Promise((resolve) => {
		exec(command, { cwd }, (error, stdout, stderr) => {
			if (error) {
				console.error(`Command failed: ${command}\n${stderr}`);
				resolve({ success: false, error: stderr.trim() });
			} else {
				console.log(`Command succeeded: ${command}\n${stdout}`);
				resolve({ success: true });
			}
		});
	});
}

// // Register the command
// export function activate(context: vscode.ExtensionContext) {
// 	context.subscriptions.push(initDeployment, addEnvVariables, installDependencies, buildFrontend, buildFullstack);
// }

// export function deactivate() { }

const deployToKoyeb = vscode.commands.registerCommand('yutools.koyeb.deployToKoyeb', async () => {
	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (!workspaceFolders) {
		vscode.window.showErrorMessage('No workspace folder is open. Please open a folder to deploy.');
		return;
	}

	const rootPath = workspaceFolders[0].uri.fsPath;
	const configFilePath = path.join(rootPath, 'koyeb-config.json');

	// Check if koyeb-config.json exists
	if (!fs.existsSync(configFilePath)) {
		vscode.window.showErrorMessage('koyeb-config.json does not exist. Please run "Yutools: Init Deployment" first.');
		return;
	}

	// Read the configuration file
	let config;
	try {
		const configContent = fs.readFileSync(configFilePath, 'utf8');
		config = JSON.parse(configContent);
	} catch (error: any) {
		vscode.window.showErrorMessage(`Failed to read koyeb-config.json: ${error.message}`);
		return;
	}

	// Validate necessary fields in the configuration
	const { appName, env, buildCommand } = config;
	if (!appName) {
		vscode.window.showErrorMessage('App name is not specified in koyeb-config.json. Please update the configuration.');
		return;
	}

	// Construct the koyeb deploy command
	const deployCommand = `koyeb deploy --name ${appName} ${env ? Object.entries(env).map(([key, value]) => `--env ${key}=${value}`).join(' ') : ''
		}`;

	vscode.window.showInformationMessage(`Deploying ${appName} to Koyeb...`);

	// Run the deploy command
	vscode.window.withProgress(
		{ location: vscode.ProgressLocation.Notification, title: `Deploying ${appName} to Koyeb...` },
		() =>
			new Promise<void>((resolve, reject) => {
				exec(deployCommand, { cwd: rootPath }, (error, stdout, stderr) => {
					if (error) {
						vscode.window.showErrorMessage(`Deployment failed: ${stderr}`);
						return reject(error);
					}
					vscode.window.showInformationMessage(`Deployment succeeded for ${appName}.`);
					console.log(stdout);
					resolve();
				});
			})
	);
});

// // Register the command
// export function activate(context: vscode.ExtensionContext) {
// 	context.subscriptions.push(
// 		initDeployment,
// 		addEnvVariables,
// 		installDependencies,
// 		buildFrontend,
// 		buildFullstack,
// 		deployToKoyeb
// 	);
// }

// export function deactivate() { }


const openAppURL = vscode.commands.registerCommand('yutools.koyeb.openAppURL', async () => {
	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (!workspaceFolders) {
		vscode.window.showErrorMessage('No workspace folder is open. Please open a folder to open the app URL.');
		return;
	}

	const rootPath = workspaceFolders[0].uri.fsPath;
	const configFilePath = path.join(rootPath, 'koyeb-config.json');

	// Check if koyeb-config.json exists
	if (!fs.existsSync(configFilePath)) {
		vscode.window.showErrorMessage('koyeb-config.json does not exist. Please run "Yutools: Init Deployment" first.');
		return;
	}

	// Read the configuration file
	let config;
	try {
		const configContent = fs.readFileSync(configFilePath, 'utf8');
		config = JSON.parse(configContent);
	} catch (error: any) {
		vscode.window.showErrorMessage(`Failed to read koyeb-config.json: ${error.message}`);
		return;
	}

	// Get the app URL from the config
	const { appURL } = config;
	if (!appURL) {
		// If no URL is specified, prompt the user for it
		const userInputURL = await vscode.window.showInputBox({
			prompt: 'Enter the app URL to open',
			placeHolder: 'e.g., https://my-app.koyeb.app'
		});

		if (!userInputURL) {
			vscode.window.showErrorMessage('No URL provided. Unable to open the app.');
			return;
		}

		// Save the URL back to the config file for future use
		config.appURL = userInputURL;
		fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));
	}

	// Open the URL in the default browser
	const finalURL = appURL || config.appURL;
	vscode.window.showInformationMessage(`Opening ${finalURL}...`);
	await open(finalURL);
});

// // Register the command
// export function activate(context: vscode.ExtensionContext) {
// 	context.subscriptions.push(
// 		initDeployment,
// 		addEnvVariables,
// 		installDependencies,
// 		buildFrontend,
// 		buildFullstack,
// 		deployToKoyeb,
// 		openAppURL
// 	);
// }

// export function deactivate() { }
const authenticate = vscode.commands.registerCommand('yutools.koyeb.authenticate', async () => {
	// Prompt user for Koyeb API token
	const apiToken = await vscode.window.showInputBox({
		prompt: 'Enter your Koyeb API token',
		placeHolder: 'Paste your Koyeb API token here',
		ignoreFocusOut: true, // Keeps the input box open if the user clicks outside
		password: true // Masks the input
	});

	if (!apiToken) {
		vscode.window.showErrorMessage('Authentication canceled. No token provided.');
		return;
	}

	// Store the API token securely using VS Code's SecretStorage API
	try {
		const secretStorage = vscode.workspace.getConfiguration();
		await vscode.authentication.getSession('yutools.koyeb', ['store'], { createIfNone: true }).then((session) => {
			session.accessToken === apiToken
		})
		secretStorage.update('koyeb.apiToken', apiToken);
		vscode.window.showInformationMessage('Koyeb API token stored successfully.');
	} catch (error: any) {
		vscode.window.showErrorMessage(`Failed to store API token: ${error.message}`);
		return;
	}

	// Validate the token by making a test API call to Koyeb
	try {
		const response = await fetch('https://app.koyeb.com/v1/apps', {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${apiToken}`
			}
		});

		if (response.status === 200) {
			vscode.window.showInformationMessage('Authentication successful! You are connected to Koyeb.');
		} else {
			vscode.window.showErrorMessage(
				`Authentication failed! Ensure the token is valid. Error: ${response.statusText}`
			);
		}
	} catch (error: any) {
		vscode.window.showErrorMessage(`Failed to validate the API token: ${error.message}`);
	}
});

// // Register the command
// export function activate(context: vscode.ExtensionContext) {
// 	context.subscriptions.push(
// 			initDeployment,
// 			addEnvVariables,
// 			installDependencies,
// 			buildFrontend,
// 			buildFullstack,
// 			deployToKoyeb,
// 			openAppURL,
// 			authenticate
// 	);
// }

const selectRepo = vscode.commands.registerCommand('yutools.koyeb.selectRepo', async () => {
	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (!workspaceFolders) {
		vscode.window.showErrorMessage('No workspace folder is open. Please open a folder to select a repository.');
		return;
	}

	const rootPath = workspaceFolders[0].uri.fsPath;
	const configFilePath = path.join(rootPath, 'koyeb-config.json');

	// Get GitHub token from storage
	// const githubToken = await vscode.workspace.getConfiguration().get('yutools.koyeb.githubToken');
	const githubToken = await vscode.workspace.getConfiguration().get('yutools.koyeb.githubToken') as string;

	if (!githubToken) {
		// Prompt user for GitHub API token if not stored
		const token = await vscode.window.showInputBox({
			prompt: 'Enter your GitHub Personal Access Token',
			placeHolder: 'GitHub API token',
			ignoreFocusOut: true,
			password: true,
		});
		if (token) {
			// Store the token for future use
			await vscode.workspace.getConfiguration().update('yutools.koyeb.githubToken', token, vscode.ConfigurationTarget.Global);
		} else {
			vscode.window.showErrorMessage('No GitHub token provided.');
			return;
		}
	}

	// Fetch GitHub repositories
	const fetchRepositories = async (token: string) => {
		return new Promise<string[]>((resolve, reject) => {
			const options = {
				hostname: 'api.github.com',
				path: '/user/repos',
				method: 'GET',
				headers: {
					'Authorization': `token ${token}`,
					'User-Agent': 'VSCode Extension'
				}
			};

			const req = https.request(options, (res) => {
				let data = '';
				res.on('data', chunk => {
					data += chunk;
				});

				res.on('end', () => {
					const repos = JSON.parse(data);
					if (Array.isArray(repos)) {
						resolve(repos.map((repo: any) => repo.full_name));
					} else {
						reject('Failed to fetch repositories');
					}
				});
			});

			req.on('error', (error) => {
				reject(`Request failed: ${error.message}`);
			});

			req.end();
		});
	};

	try {
		const repos = await fetchRepositories(githubToken);
		if (repos.length === 0) {
			vscode.window.showErrorMessage('No repositories found for the authenticated GitHub user.');
			return;
		}

		// Let user select repository
		const selectedRepo = await vscode.window.showQuickPick(repos, {
			placeHolder: 'Select a GitHub repository to deploy'
		});

		if (!selectedRepo) {
			vscode.window.showErrorMessage('No repository selected.');
			return;
		}

		// Store the selected repository URL in the configuration
		const config = fs.existsSync(configFilePath) ? JSON.parse(fs.readFileSync(configFilePath, 'utf8')) : {};
		config.repoUrl = selectedRepo;
		fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));

		vscode.window.showInformationMessage(`Selected repository: ${selectedRepo}`);
	} catch (error: any) {
		vscode.window.showErrorMessage(`Failed to fetch repositories: ${error}`);
	}
});

// // Register the command
// export function activate(context: vscode.ExtensionContext) {
// 	context.subscriptions.push(
// 		initDeployment,
// 		addEnvVariables,
// 		installDependencies,
// 		buildFrontend,
// 		buildFullstack,
// 		deployToKoyeb,
// 		openAppURL,
// 		authenticate,
// 		selectRepo
// 	);
// }

// export function deactivate() { }
const viewStatus = vscode.commands.registerCommand('yutools.koyeb.viewStatus', async () => {
	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (!workspaceFolders) {
		vscode.window.showErrorMessage('No workspace folder is open. Please open a folder to view the app status.');
		return;
	}

	const rootPath = workspaceFolders[0].uri.fsPath;
	const configFilePath = path.join(rootPath, 'koyeb-config.json');

	// Check if koyeb-config.json exists
	if (!fs.existsSync(configFilePath)) {
		vscode.window.showErrorMessage('koyeb-config.json does not exist. Please run "Yutools: Init Deployment" first.');
		return;
	}

	// Read the configuration file
	let config;
	try {
		const configContent = fs.readFileSync(configFilePath, 'utf8');
		config = JSON.parse(configContent);
	} catch (error: any) {
		vscode.window.showErrorMessage(`Failed to read koyeb-config.json: ${error.message}`);
		return;
	}

	const { appName } = config;
	if (!appName) {
		vscode.window.showErrorMessage('App name is not specified in koyeb-config.json. Please update the configuration.');
		return;
	}

	// Fetch the status of the application from Koyeb
	const fetchStatus = async () => {
		const token = await vscode.workspace.getConfiguration().get('yutools.koyeb.githubToken');
		if (!token) {
			vscode.window.showErrorMessage('GitHub token is missing. Please authenticate first.');
			return;
		}

		const options = {
			hostname: 'app.koyeb.com',
			path: `/v1/apps/${appName}/status`,  // Assuming this is the Koyeb API endpoint for app status
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${token}`,
				'User-Agent': 'VSCode Extension'
			}
		};

		return new Promise<any>((resolve, reject) => {
			const req = https.request(options, (res) => {
				let data = '';
				res.on('data', chunk => {
					data += chunk;
				});

				res.on('end', () => {
					// const status = JSON.parse(data);
					// if (status) {
					// 	resolve(status);
					// } else {
					// 	reject('Failed to retrieve status.');
					// }
					try {
						const status = JSON.parse(data);  // CHANGED: Added try-catch for JSON parsing
						if (status && status.appName) {
							resolve(status);  // CHANGED: Ensure status has appName
						} else {
							reject('Failed to retrieve valid status.');
						}
					} catch (error: any) {
						reject(`Failed to parse response: ${error.message}`);  // CHANGED: Catch JSON parsing errors
					}
				});
			});

			req.on('error', (error) => {
				reject(`Request failed: ${error.message}`);
			});

			req.end();
		});
	};

	try {
		const status = await fetchStatus();
		if (status) {
			const statusMessage = `App Name: ${status.appName}\nStatus: ${status.status}\nHealth: ${status.healthCheck}\nLogs:\n${status.logs || 'No logs available.'}`;
			vscode.window.showInformationMessage(statusMessage);
		} else {
			vscode.window.showErrorMessage('Failed to retrieve application status.');
		}
	} catch (error) {
		vscode.window.showErrorMessage(`Error fetching status: ${error}`);
	}
});

// 	// Fetch the status of the application from Koyeb
// 	const fetchStatus = async () => {
// 		const token = await vscode.workspace.getConfiguration().get('yutools.koyeb.githubToken');
// 		if (!token) {
// 			vscode.window.showErrorMessage('GitHub token is missing. Please authenticate first.');
// 			return;
// 		}

// 		const options = {
// 			hostname: 'app.koyeb.com',
// 			path: `/v1/apps/${appName}/status`,  // Assuming this is the Koyeb API endpoint for app status
// 			method: 'GET',
// 			headers: {
// 				'Authorization': `Bearer ${token}`,
// 				'User-Agent': 'VSCode Extension'
// 			}
// 		};

// 		return new Promise<string>((resolve, reject) => {
// 			const req = https.request(options, (res) => {
// 				let data = '';
// 				res.on('data', chunk => {
// 					data += chunk;
// 				});

// 				res.on('end', () => {
// 					const status = JSON.parse(data);
// 					if (status) {
// 						resolve(status);
// 					} else {
// 						reject('Failed to retrieve status.');
// 					}
// 				});
// 			});

// 			req.on('error', (error) => {
// 				reject(`Request failed: ${error.message}`);
// 			});

// 			req.end();
// 		});
// 	};

// 	try {
// 		const status = await fetchStatus();
// 		if (status) {
// 			const statusMessage = `App Name: ${status.appName}\nStatus: ${status.status}\nHealth: ${status.healthCheck}\nLogs:\n${status.logs || 'No logs available.'}`;
// 			vscode.window.showInformationMessage(statusMessage);
// 		} else {
// 			vscode.window.showErrorMessage('Failed to retrieve application status.');
// 		}
// 	} catch (error: any) {
// 		vscode.window.showErrorMessage(`Error fetching status: ${error}`);
// 	}
// });

// interface AppStatus {
// 	appName: string;
// 	status: string;
// 	healthCheck: string;
// 	logs?: string;
// }

// const fetchStatus = async (): Promise<AppStatus> => {
// 	// API call and logic
// };

// const fetchStatus = async (): Promise<AppStatus> => {
// 	const token = await vscode.workspace.getConfiguration().get('yutools.koyeb.githubToken');
// 	if (!token) {
// 		vscode.window.showErrorMessage('GitHub token is missing. Please authenticate first.');
// 		return { appName: '', status: '', healthCheck: '', logs: '' };
// 	}

// 	const options = {
// 		hostname: 'app.koyeb.com',
// 		path: `/v1/apps/${appName}/status`,  // Assuming this is the correct API endpoint
// 		method: 'GET',
// 		headers: {
// 			'Authorization': `Bearer ${token}`,
// 			'User-Agent': 'VSCode Extension'
// 		}
// 	};

// 	return new Promise<any>((resolve, reject) => { // Use any to represent the expected object response
// 		const req = https.request(options, (res) => {
// 			let data = '';
// 			res.on('data', chunk => {
// 				data += chunk;
// 			});

// 			res.on('end', () => {
// 				try {
// 					const status = JSON.parse(data);
// 					resolve(status);
// 				} catch (error) {
// 					reject('Failed to parse status.');
// 				}
// 			});
// 		});

// 		req.on('error', (error) => {
// 			reject(`Request failed: ${error.message}`);
// 		});

// 		req.end();
// 	});
// };

// // Use the expected properties (appName, status, etc.) from the status object
// const statusMessage = `App Name: ${status.appName}\nStatus: ${status.status}\nHealth: ${status.healthCheck}\nLogs:\n${status.logs || 'No logs available.'}`;

// // Register the command
// export function activate(context: vscode.ExtensionContext) {
// 	context.subscriptions.push(
// 		initDeployment,
// 		addEnvVariables,
// 		installDependencies,
// 		buildFrontend,
// 		buildFullstack,
// 		deployToKoyeb,
// 		openAppURL,
// 		authenticate,
// 		selectRepo,
// 		viewStatus
// 	);
// }

// export function deactivate() { }
const deployFullstack = vscode.commands.registerCommand('yutools.koyeb.deployFullstack', async () => {
	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (!workspaceFolders) {
		vscode.window.showErrorMessage('No workspace folder is open. Please open a folder to deploy the fullstack application.');
		return;
	}

	const rootPath = workspaceFolders[0].uri.fsPath;
	const configFilePath = path.join(rootPath, 'koyeb-config.json');

	// Check if koyeb-config.json exists
	if (!fs.existsSync(configFilePath)) {
		vscode.window.showErrorMessage('koyeb-config.json does not exist. Please run "Yutools: Init Deployment" first.');
		return;
	}

	// Read the configuration file
	let config;
	try {
		const configContent = fs.readFileSync(configFilePath, 'utf8');
		config = JSON.parse(configContent);
	} catch (error: any) {
		vscode.window.showErrorMessage(`Failed to read koyeb-config.json: ${error.message}`);
		return;
	}

	const { repoUrl, appName, environment } = config;
	if (!repoUrl || !appName || !environment) {
		vscode.window.showErrorMessage('Repository URL, app name, or environment is missing in koyeb-config.json. Please update the configuration.');
		return;
	}

	try {
		// Step 1: Build frontend and backend
		await vscode.window.withProgress(
			{
				location: vscode.ProgressLocation.Notification,
				title: 'Building frontend and backend...',
			},
			async () => {
				await execShellCommand('npm run build');
				await execShellCommand('npm run build-backend');
			}
		);

		// Step 2: Deploy both frontend and backend to Koyeb
		const deployUrl = `https://api.koyeb.com/v1/apps/${appName}/deploy`;
		const deployPayload = {
			repo_url: repoUrl,
			environment: environment,
			target: 'fullstack', // Assume fullstack deployment target
		};

		const response = await fetch(deployUrl, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${await getApiToken()}`, // Assumes a function to get the API token
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(deployPayload),
		});

		const data = await response.json();
		if (response.ok) {
			vscode.window.showInformationMessage(`Fullstack deployed successfully! App URL: ${data.appUrl}`);
		} else {
			vscode.window.showErrorMessage(`Deployment failed: ${data.error || 'Unknown error'}`);
		}
	} catch (error: any) {
		vscode.window.showErrorMessage(`Error deploying fullstack: ${error.message}`);
	}
});

const deployBackend = vscode.commands.registerCommand('yutools.koyeb.deployBackend', async () => {
	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (!workspaceFolders) {
		vscode.window.showErrorMessage('No workspace folder is open. Please open a folder to deploy the backend.');
		return;
	}

	const rootPath = workspaceFolders[0].uri.fsPath;
	const configFilePath = path.join(rootPath, 'koyeb-config.json');

	// Check if koyeb-config.json exists
	if (!fs.existsSync(configFilePath)) {
		vscode.window.showErrorMessage('koyeb-config.json does not exist. Please run "Yutools: Init Deployment" first.');
		return;
	}

	// Read the configuration file
	let config;
	try {
		const configContent = fs.readFileSync(configFilePath, 'utf8');
		config = JSON.parse(configContent);
	} catch (error: any) {
		vscode.window.showErrorMessage(`Failed to read koyeb-config.json: ${error.message}`);
		return;
	}

	const { repoUrl, appName, environment } = config;
	if (!repoUrl || !appName || !environment) {
		vscode.window.showErrorMessage('Repository URL, app name, or environment is missing in koyeb-config.json. Please update the configuration.');
		return;
	}

	try {
		// Step 1: Build backend
		await vscode.window.withProgress(
			{
				location: vscode.ProgressLocation.Notification,
				title: 'Building backend...',
			},
			async () => {
				// Replace with actual build command for backend
				await execShellCommand('npm run build-backend');
			}
		);

		// Step 2: Deploy backend to Koyeb
		const deployUrl = `https://api.koyeb.com/v1/apps/${appName}/deploy`;
		const deployPayload = {
			repo_url: repoUrl,
			environment: environment,
			target: 'backend', // Assume backend deployment target
		};

		const response = await fetch(deployUrl, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${await getApiToken()}`, // Assumes a function to get the API token
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(deployPayload),
		});

		const data = await response.json();
		if (response.ok) {
			vscode.window.showInformationMessage(`Backend deployed successfully! App URL: ${data.appUrl}`);
		} else {
			vscode.window.showErrorMessage(`Deployment failed: ${data.error || 'Unknown error'}`);
		}
	} catch (error: any) {
		vscode.window.showErrorMessage(`Error deploying backend: ${error.message}`);
	}
});

const deployFrontend = vscode.commands.registerCommand('yutools.koyeb.deployFrontend', async () => {
	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (!workspaceFolders) {
		vscode.window.showErrorMessage('No workspace folder is open. Please open a folder to deploy the frontend.');
		return;
	}

	const rootPath = workspaceFolders[0].uri.fsPath;
	const configFilePath = path.join(rootPath, 'koyeb-config.json');

	// Check if koyeb-config.json exists
	if (!fs.existsSync(configFilePath)) {
		vscode.window.showErrorMessage('koyeb-config.json does not exist. Please run "Yutools: Init Deployment" first.');
		return;
	}

	// Read the configuration file
	let config;
	try {
		const configContent = fs.readFileSync(configFilePath, 'utf8');
		config = JSON.parse(configContent);
	} catch (error: any) {
		vscode.window.showErrorMessage(`Failed to read koyeb-config.json: ${error.message}`);
		return;
	}

	const { repoUrl, appName, environment } = config;
	if (!repoUrl || !appName || !environment) {
		vscode.window.showErrorMessage('Repository URL, app name, or environment is missing in koyeb-config.json. Please update the configuration.');
		return;
	}

	try {
		// Step 1: Build frontend
		await vscode.window.withProgress(
			{
				location: vscode.ProgressLocation.Notification,
				title: 'Building frontend...',
			},
			async () => {
				// Replace with actual build command, e.g., npm run build or yarn build
				await execShellCommand('npm run build');
			}
		);

		// Step 2: Deploy frontend to Koyeb
		const deployUrl = `https://api.koyeb.com/v1/apps/${appName}/deploy`;
		const deployPayload = {
			repo_url: repoUrl,
			environment: environment,
			target: 'frontend', // Assume frontend deployment target
		};

		const response = await fetch(deployUrl, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${await getApiToken()}`, // Assumes a function to get the API token
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(deployPayload),
		});

		const data = await response.json();
		if (response.ok) {
			vscode.window.showInformationMessage(`Frontend deployed successfully! App URL: ${data.appUrl}`);
		} else {
			vscode.window.showErrorMessage(`Deployment failed: ${data.error || 'Unknown error'}`);
		}
	} catch (error: any) {
		vscode.window.showErrorMessage(`Error deploying frontend: ${error.message}`);
	}
});

// // Helper function to get API token
// async function getApiToken(): Promise<string> {
// 	const token = await vscode.workspace.getConfiguration().get('yutools.koyeb.apiToken');
// 	if (!token) {
// 		throw new Error('API token is missing. Please authenticate first.');
// 	}
// 	return token;
// }
async function getApiToken(): Promise<string> {
	const token = await vscode.workspace.getConfiguration().get('yutools.koyeb.apiToken') as string; // Type assertion
	if (!token) {
		throw new Error('API token is missing. Please authenticate first.');
	}
	return token;
}
