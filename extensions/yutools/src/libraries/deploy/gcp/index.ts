import * as vscode from 'vscode';
import { exec } from 'child_process';

/**
 * Run a shell command and return its output.
 * @param {string} command
 * @returns {Promise<string>}
 */
function runCommand(command: string) {
	return new Promise((resolve, reject) => {
		exec(command, (error, stdout, stderr) => {
			if (error) {
				reject(stderr || error.message);
			} else {
				resolve(stdout);
			}
		});
	});
}
// export const runCommand = (command: string, callback: (error: string | null, stdout: string, stderr: string) => void) => {
// 	exec(command, (error, stdout, stderr) => {
// 		callback(error ? error.message : null, stdout, stderr);
// 	});
// };

/**
 * Quick Deploy Current Project to GCP (App Engine)
 */
async function quickDeploy() {
	try {
		const terminal = vscode.window.createTerminal("Quick Deploy");
		terminal.show();

		// Command to deploy to App Engine
		const deployCommand = "gcloud app deploy --quiet";
		terminal.sendText(deployCommand);

		vscode.window.showInformationMessage("Deployment started: Running 'gcloud app deploy'");
	} catch (error) {
		vscode.window.showErrorMessage(`Quick Deploy failed: ${error}`);
	}
}

/**
 * Deploy Current Project to GCP Cloud Functions
 */
async function deployToCloudFunctions() {
	try {
		const terminal = vscode.window.createTerminal("Deploy to Cloud Functions");
		terminal.show();

		// Command to deploy Cloud Functions
		const deployCommand = "gcloud functions deploy my-function-name --runtime=nodejs18 --trigger-http --allow-unauthenticated";
		terminal.sendText(deployCommand);

		vscode.window.showInformationMessage("Deployment started: Running 'gcloud functions deploy'");
	} catch (error) {
		vscode.window.showErrorMessage(`Deployment to Cloud Functions failed: ${error}`);
	}
}

/**
 * Deploy Frontend to GCP Cloud Storage
 */
async function deployFrontend() {
	try {
		const terminal = vscode.window.createTerminal("Deploy Frontend");
		terminal.show();

		// Command to sync static files to Cloud Storage
		const bucketName = "your-bucket-name"; // Replace with your bucket name
		const syncCommand = `gsutil -m rsync -r ./build gs://${bucketName}`;
		terminal.sendText(syncCommand);

		vscode.window.showInformationMessage("Frontend deployment started: Uploading to Cloud Storage");
	} catch (error) {
		vscode.window.showErrorMessage(`Frontend deployment failed: ${error}`);
	}
}

/**
 * Deploy Full-Stack Application
 */
async function deployFullStack() {
	try {
		vscode.window.showInformationMessage("Starting full-stack deployment...");

		// Deploy frontend
		await deployFrontend();

		// Deploy backend
		await deployToCloudFunctions();

		vscode.window.showInformationMessage("Full-stack deployment completed!");
	} catch (error) {
		vscode.window.showErrorMessage(`Full-stack deployment failed: ${error}`);
	}
}

/**
 * Set the GCP Project
 */
async function setGCPProject() {
	try {
		const projectId = await vscode.window.showInputBox({
			prompt: "Enter the GCP Project ID to set as active:"
		});

		if (!projectId) {
			vscode.window.showErrorMessage("No project ID provided.");
			return;
		}

		const terminal = vscode.window.createTerminal("Set GCP Project");
		terminal.show();

		const setProjectCommand = `gcloud config set project ${projectId}`;
		terminal.sendText(setProjectCommand);

		vscode.window.showInformationMessage(`GCP Project set to: ${projectId}`);
	} catch (error) {
		vscode.window.showErrorMessage(`Failed to set GCP Project: ${error}`);
	}
}

/**
 * Check Deployment Status
 */
async function checkDeploymentStatus() {
	try {
		const terminal = vscode.window.createTerminal("Check Deployment Status");
		terminal.show();

		const statusCommand = "gcloud app describe";
		terminal.sendText(statusCommand);

		vscode.window.showInformationMessage("Fetching deployment status...");
	} catch (error) {
		vscode.window.showErrorMessage(`Failed to check deployment status: ${error}`);
	}
}

/**
 * Deploy to Cloud Run
 */
async function deployToCloudRun() {
	try {
		const serviceName = await vscode.window.showInputBox({
			prompt: "Enter the Cloud Run service name:"
		});

		if (!serviceName) {
			vscode.window.showErrorMessage("No service name provided.");
			return;
		}

		const terminal = vscode.window.createTerminal("Deploy to Cloud Run");
		terminal.show();

		const deployCommand = `gcloud run deploy ${serviceName} --source . --region=us-central1 --allow-unauthenticated`;
		terminal.sendText(deployCommand);

		vscode.window.showInformationMessage(`Cloud Run deployment started for service: ${serviceName}`);
	} catch (error) {
		vscode.window.showErrorMessage(`Deployment to Cloud Run failed: ${error}`);
	}
}

/**
 * View Logs
 */
async function viewLogs() {
	try {
		const logName = await vscode.window.showInputBox({
			prompt: "Enter the log name (e.g., app engine, cloud run, cloud functions):"
		});

		if (!logName) {
			vscode.window.showErrorMessage("No log name provided.");
			return;
		}

		const terminal = vscode.window.createTerminal("View Logs");
		terminal.show();

		const logsCommand = `gcloud logging read "resource.type=${logName}" --limit 50 --format="value(textPayload)"`;
		terminal.sendText(logsCommand);

		vscode.window.showInformationMessage(`Fetching logs for: ${logName}`);
	} catch (error) {
		vscode.window.showErrorMessage(`Failed to fetch logs: ${error}`);
	}
}

/**
 * Activate the extension.
 * @param {vscode.ExtensionContext} context
 */
export function register_gcp_commands(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('yutools.gcp.quickDeploy', quickDeploy),
		vscode.commands.registerCommand('yutools.gcp.deployToCloudFunctions', deployToCloudFunctions),
		vscode.commands.registerCommand('yutools.gcp.deployFrontend', deployFrontend),
		vscode.commands.registerCommand('yutools.gcp.deployFullStack', deployFullStack),
		vscode.commands.registerCommand('yutools.gcp.setGCPProject', setGCPProject),
		vscode.commands.registerCommand('yutools.gcp.checkDeploymentStatus', checkDeploymentStatus),
		vscode.commands.registerCommand('yutools.gcp.deployToCloudRun', deployToCloudRun),
		vscode.commands.registerCommand('yutools.gcp.viewLogs', viewLogs)
	);

	vscode.window.showInformationMessage("Yutools GCP Deployment Extension Activated!");
}
