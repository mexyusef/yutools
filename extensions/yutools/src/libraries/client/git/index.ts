import * as vscode from "vscode";
import { gitCommitWithLLM } from "./git_commit_llm";

export function register_git_commands(context: vscode.ExtensionContext) {
	context.subscriptions.push(gitCommitWithLLM);
}
