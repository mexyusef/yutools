import * as path from 'path';
import * as fs from 'fs/promises';
import * as vscode from 'vscode';

/**
 * Represents the context of a project, including file-based and content-based indicators.
 */
export class ProjectContext {
	private fileIndicators: Map<string, string[]>;
	private contentIndicators: Map<string, (fileContent: string) => string[]>;
	private _labels: string[];

	constructor() {
		this.fileIndicators = new Map();
		this.contentIndicators = new Map();
		this._labels = [];
		this.initializeIndicators();
	}

	/**
	 * Retrieves the collected labels, removing redundant entries.
	 */
	get labels(): string[] {
		if (this._labels.includes('javascript') && this._labels.includes('typescript')) {
			const index = this._labels.indexOf('javascript');
			this._labels.splice(index, 1);
		}
		return Array.from(new Set(this._labels));
	}

	/**
	 * Collects context labels for a given set of folders.
	 *
	 * @param folders - Array of folder paths.
	 */
	async collectContext(folders: string[]): Promise<void> {
		await Promise.all(folders.map(async (folder) => this.addContextForFolder(folder)));
	}


	async collectContextDefault() {
		// get some context about the workspace we are in and what we are upto
		// const projectContext = new ProjectContext();
		// await projectContext.collectContextDefault();
		// Register the agent session provider
		// const agentSessionProvider = new AideAgentSessionProvider(currentRepo, projectContext, sidecarClient, recentEditsRetriever, context,);
		// const editorUrl = agentSessionProvider.editorUrl;
		// context.subscriptions.push(agentSessionProvider);


		const workspaceFolders = vscode.workspace.workspaceFolders;
		if (workspaceFolders !== undefined) {
			await Promise.all(workspaceFolders.map(async (folder) => {
				await this.addContextForFolder(folder.uri.fsPath);
			}));
		}
	}

	/**
	 * Adds context labels for a specific folder.
	 *
	 * @param folderPath - The path of the folder to analyze.
	 */
	private async addContextForFolder(folderPath: string): Promise<void> {
		await Promise.all(Array.from(this.fileIndicators.entries()).map(async ([fileName, labels]) => {
			await this.addLabelIfApplicable(folderPath, fileName, labels);
		}));
	}

	/**
	 * Checks if a file exists and collects labels if applicable.
	 *
	 * @param folderPath - The folder path to search within.
	 * @param fileName - The file name to check for.
	 * @param labels - The labels to assign if the file exists.
	 */
	private async addLabelIfApplicable(folderPath: string, fileName: string, labels: string[]): Promise<void> {
		const filePath = path.join(folderPath, fileName);
		try {
			await fs.access(filePath); // Check if the file exists
			labels.forEach((label) => this._labels.push(label));

			const contentIndicator = this.contentIndicators.get(fileName);
			if (contentIndicator) {
				const fileContent = await fs.readFile(filePath, 'utf-8');
				contentIndicator(fileContent).forEach((label) => this._labels.push(label));
			}
		} catch {
			// File does not exist or is inaccessible
		}
	}

	/**
	 * Adds a file-based indicator.
	 *
	 * @param fileName - The file name to check for.
	 * @param labels - Labels to assign if the file exists.
	 */
	addFileIndicator(fileName: string, ...labels: string[]): void {
		this.fileIndicators.set(fileName, labels);
	}

	/**
	 * Adds a content-based indicator.
	 *
	 * @param fileName - The file name to apply the indicator function to.
	 * @param indicatorFunction - A function that analyzes file content and returns labels.
	 */
	addContentIndicator(fileName: string, indicatorFunction: (fileContent: string) => string[]): void {
		this.contentIndicators.set(fileName, indicatorFunction);
	}

	/**
	 * Initializes default file and content indicators.
	 */
	private initializeIndicators(): void {
		this.addFileIndicator('package.json', 'javascript', 'npm');
		this.addFileIndicator('tsconfig.json', 'typescript');
		this.addFileIndicator('pom.xml', 'java', 'maven');
		this.addFileIndicator('build.gradle', 'java', 'gradle');
		this.addFileIndicator('requirements.txt', 'python', 'pip');
		this.addFileIndicator('Pipfile', 'python', 'pip');
		this.addFileIndicator('Cargo.toml', 'rust', 'cargo');
		this.addFileIndicator('go.mod', 'go', 'go.mod');
		this.addFileIndicator('pubspec.yaml', 'dart', 'pub');
		this.addFileIndicator('build.sbt', 'scala', 'sbt');
		this.addFileIndicator('project.clj', 'clojure', 'lein');
		this.addFileIndicator('composer.json', 'php', 'composer');
		this.addFileIndicator('Gemfile', 'ruby', 'bundler');
		this.addContentIndicator('package.json', this.collectPackageJsonIndicators);
	}

	/**
	 * Analyzes a `package.json` file for specific indicators.
	 *
	 * @param fileContent - The content of the `package.json` file.
	 * @returns An array of detected labels.
	 */
	private collectPackageJsonIndicators(fileContent: string): string[] {
		const labels: string[] = [];
		try {
			const parsedContent = JSON.parse(fileContent);
			const { dependencies, devDependencies, engines } = parsedContent;

			if (dependencies) {
				if (dependencies['@angular/core']) labels.push('angular');
				if (dependencies.react) labels.push('react');
				if (dependencies.vue) labels.push('vue');
			}

			if (devDependencies?.typescript) {
				labels.push('typescript');
			}

			if (engines) {
				if (engines.node) labels.push('node');
				if (engines.vscode) labels.push('vscode extension');
			}
		} catch {
			// Ignore malformed JSON
		}
		return labels;
	}
}

// import { ProjectContext } from './core/ProjectContext';
async function main() {
	const projectContext = new ProjectContext();

	// Add custom indicators
	projectContext.addFileIndicator('.env', 'environment');
	projectContext.addContentIndicator('README.md', (content) => {
		return content.includes('TODO') ? ['todo'] : [];
	});

	// Collect context for workspace folders
	await projectContext.collectContext(['/path/to/project/folder']);
	console.log('Detected Labels:', projectContext.labels);
}
// main();
