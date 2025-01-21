import { Anthropic } from "@anthropic-ai/sdk";
import fs from "fs/promises";
import * as path from "path";
import { serializeError } from "serialize-error";

import * as diff from "diff";
import { execa } from "execa";
import { globby } from "globby";
import pWaitFor from "p-wait-for";

import { tools, ToolName } from "./shared/tools";
import { VsGentAsk, VsGentSay, VsGentSayTool } from "./shared/ExtensionMessage";
import { analyzeProject } from "./analyze-project";

import { DEFAULT_MAX_REQUESTS_PER_TASK } from "./shared/constants";
import { VsGentAskResponse } from "./shared/WebviewMessage";
import { VsGentProvider } from "./providers/vsgent-provider";
import { VsGentRequestResult } from "./shared/VsGentRequestResult";

// SYSTEM PROMPT extracted to keep the main file clean
import { SYSTEM_PROMPT, USER_PROMPT } from "./shared/SystemPrompt";

// Modularization and Single Responsibility enhancements
export class VsGent {
	private client: Anthropic;
	private maxRequestsPerTask: number;
	private requestCount = 0;
	private askResponse?: VsGentAskResponse;
	private askResponseText?: string;
	private providerRef: WeakRef<VsGentProvider>;
	abort: boolean = false;

	constructor(provider: VsGentProvider, task: string, apiKey: string, maxRequestsPerTask?: number) {
		this.providerRef = new WeakRef(provider);
		this.client = new Anthropic({ apiKey });
		this.maxRequestsPerTask = maxRequestsPerTask ?? DEFAULT_MAX_REQUESTS_PER_TASK;
		this.startTask(task);
	}

	updateApiKey(apiKey: string) {
		this.client = new Anthropic({ apiKey });
	}

	updateMaxRequestsPerTask(maxRequestsPerTask: number | undefined) {
		this.maxRequestsPerTask = maxRequestsPerTask ?? DEFAULT_MAX_REQUESTS_PER_TASK;
	}

	async handleWebviewAskResponse(askResponse: VsGentAskResponse, text?: string) {
		this.askResponse = askResponse;
		this.askResponseText = text;
	}

	// Simplified error handling for file operations
	private async safeFileOperation<T>(operation: () => Promise<T>, errorMessage: string): Promise<T | string> {
		try {
			return await operation();
		} catch (error) {
			const serializedError = serializeError(error);
			const message = `${errorMessage}: ${serializedError.message || JSON.stringify(serializedError)}`;
			this.say("error", message);
			return message;
		}
	}

	async writeToFile(filePath: string, content: string): Promise<string> {
		return this.safeFileOperation(
			async () => {
				const directoryPath = path.dirname(filePath);
				await fs.mkdir(directoryPath, { recursive: true });
				await fs.writeFile(filePath, content);
				return `File written successfully to ${filePath}`;
			},
			`Error writing to file ${filePath}`
		);
	}

	async readFile(filePath: string): Promise<string> {
		return this.safeFileOperation(
			async () => await fs.readFile(filePath, "utf-8"),
			`Error reading file ${filePath}`
		);
	}

	async startTask(task: string): Promise<void> {
		await this.providerRef.deref()?.setVsGentMessages(undefined);
		await this.providerRef.deref()?.postStateToWebview();

		let userPrompt = `Task: "${task}"`;

		await this.say("text", task);

		let totalInputTokens = 0;
		let totalOutputTokens = 0;

		while (this.requestCount < this.maxRequestsPerTask) {
			// const { didEndLoop, inputTokens, outputTokens } = await this.processRequest([
			const { didEndLoop, inputTokens, outputTokens } = await this.recursivelyMakeVsGentRequests([
				{ type: "text", text: userPrompt },
			]);
			totalInputTokens += inputTokens;
			totalOutputTokens += outputTokens;

			if (didEndLoop) { break; }

			userPrompt = USER_PROMPT; // "Ask yourself if the task is complete; otherwise, proceed.";
		}
	}

	// private async processRequest(userContent: Array<any>): Promise<{ didEndLoop: boolean; inputTokens: number; outputTokens: number }> {
	// 	// Modularized logic for request processing (implementation omitted for brevity)
	// 	return { didEndLoop: false, inputTokens: 0, outputTokens: 0 };
	// }

	private async say(type: VsGentSay, message?: string): Promise<void> {
		if (this.abort) { throw new Error("VsGent instance aborted"); }
		await this.providerRef.deref()?.addVsGentMessage({ ts: Date.now(), type: "say", say: type, text: message });
		await this.providerRef.deref()?.postStateToWebview();
	}

	async ask(type: VsGentAsk, question: string): Promise<{ response: VsGentAskResponse; text?: string }> {
		// If this VsGentDev instance was aborted by the provider, 
		// then the only thing keeping us alive is a promise still running in the background,
		// in which case we don't want to send its result to the webview as it is attached to a new instance of VsGentDev now.
		// So we can safely ignore the result of any active promises, and this class will be deallocated.
		// (Although we set vsGent = undefined in provider, that simply removes the reference to this instance,
		// but the instance is still alive until this promise resolves or rejects.)
		if (this.abort) {
			throw new Error("VsGentDev instance aborted");
		}
		this.askResponse = undefined;
		this.askResponseText = undefined;
		await this.providerRef.deref()?.addVsGentMessage({ ts: Date.now(), type: "ask", ask: type, text: question });
		await this.providerRef.deref()?.postStateToWebview();
		await pWaitFor(() => this.askResponse !== undefined, { interval: 100 });
		const result = { response: this.askResponse!, text: this.askResponseText };
		this.askResponse = undefined;
		this.askResponseText = undefined;
		return result;
	}

	async executeTool(toolName: ToolName, toolInput: any): Promise<string> {
		switch (toolName) {
			case "write_to_file":
				return this.writeToFile(toolInput.path, toolInput.content);
			case "read_file":
				return this.readFile(toolInput.path);
			case "analyze_project":
				return this.analyzeProject(toolInput.path);
			case "list_files":
				return this.listFiles(toolInput.path);
			case "execute_command":
				return this.executeCommand(toolInput.command);
			case "ask_followup_question":
				return this.askFollowupQuestion(toolInput.question);
			case "attempt_completion":
				return this.attemptCompletion(toolInput.result, toolInput.command);
			default:
				return `Unknown tool: ${toolName}`;
		}
	}

	// Calculates cost of a VsGent 3.5 Sonnet API request
	calculateApiCost(inputTokens: number, outputTokens: number): number {
		const INPUT_COST_PER_MILLION = 3.0; // $3 per million input tokens
		const OUTPUT_COST_PER_MILLION = 15.0; // $15 per million output tokens
		const inputCost = (inputTokens / 1_000_000) * INPUT_COST_PER_MILLION;
		const outputCost = (outputTokens / 1_000_000) * OUTPUT_COST_PER_MILLION;
		const totalCost = inputCost + outputCost;
		return totalCost;
	}

	async analyzeProject(dirPath: string): Promise<string> {
		try {
			const analysis = await analyzeProject(dirPath);
			const { response, text } = await this.ask(
				"tool",
				JSON.stringify({ tool: "analyzeProject", path: dirPath, content: analysis } as VsGentSayTool)
			);
			if (response !== "yesButtonTapped") {
				if (response === "textResponse" && text) {
					await this.say("user_feedback", text);
					return `The user denied this operation and provided the following feedback:\n\"${text}\"`;
				}
				return "The user denied this operation.";
			}
			return analysis;
		} catch (error) {
			const errorString = `Error analyzing project: ${JSON.stringify(serializeError(error))}`;
			this.say(
				"error",
				`Error analyzing project:\n${error.message ?? JSON.stringify(serializeError(error), null, 2)}`
			);
			return errorString;
		}
	}

	async listFiles(dirPath: string): Promise<string> {
		const absolutePath = path.resolve(dirPath);
		const root = process.platform === "win32" ? path.parse(absolutePath).root : "/";
		const isRoot = absolutePath === root;
		if (isRoot) {
			const { response, text } = await this.ask(
				"tool",
				JSON.stringify({ tool: "listFiles", path: dirPath, content: root } as VsGentSayTool)
			);
			if (response !== "yesButtonTapped") {
				if (response === "textResponse" && text) {
					await this.say("user_feedback", text);
					return `The user denied this operation and provided the following feedback:\n\"${text}\"`;
				}
				return "The user denied this operation.";
			}
			return root;
		}

		try {
			const options = {
				cwd: dirPath,
				dot: true, // Allow patterns to match files/directories that start with '.', even if the pattern does not start with '.'
				absolute: false,
				markDirectories: true, // Append a / on any directories matched
				onlyFiles: false,
			};
			// * globs all files in one dir, ** globs files in nested directories
			const entries = await globby("*", options);
			const result = entries.join("\n");
			const { response, text } = await this.ask(
				"tool",
				JSON.stringify({ tool: "listFiles", path: dirPath, content: result } as VsGentSayTool)
			);
			if (response !== "yesButtonTapped") {
				if (response === "textResponse" && text) {
					await this.say("user_feedback", text);
					return `The user denied this operation and provided the following feedback:\n\"${text}\"`;
				}
				return "The user denied this operation.";
			}
			return result;
		} catch (error) {
			const errorString = `Error listing files and directories: ${JSON.stringify(serializeError(error))}`;
			this.say(
				"error",
				`Error listing files and directories:\n${error.message ?? JSON.stringify(serializeError(error), null, 2)
				}`
			);
			return errorString;
		}
	}

	async executeCommand(command: string, returnEmptyStringOnSuccess: boolean = false): Promise<string> {
		const { response, text } = await this.ask("command", command);
		if (response !== "yesButtonTapped") {
			if (response === "textResponse" && text) {
				await this.say("user_feedback", text);
				return `The user denied this operation and provided the following feedback:\n\"${text}\"`;
			}
			return "The user denied this operation.";
		}
		try {
			let result = "";
			// execa by default tries to convery bash into javascript
			// by using shell: true we use sh on unix or cmd.exe on windows
			// also worth noting that execa`input` runs commands and the execa() creates a new instance
			for await (const line of execa({ shell: true })`${command}`) {
				this.say("command_output", line); // stream output to user in realtime
				result += `${line}\n`;
			}
			// for attemptCompletion, we don't want to return the command output
			if (returnEmptyStringOnSuccess) {
				return "";
			}
			return `Command executed successfully. Output:\n${result}`;
		} catch (e) {
			const error = e as any;
			let errorMessage = error.message || JSON.stringify(serializeError(error), null, 2);
			const errorString = `Error executing command:\n${errorMessage}`;
			this.say("error", `Error executing command:\n${errorMessage}`); // TODO: in webview show code block for command errors
			return errorString;
		}
	}

	async askFollowupQuestion(question: string): Promise<string> {
		const { text } = await this.ask("followup", question);
		await this.say("user_feedback", text ?? "");
		return `User's response:\n\"${text}\"`;
	}

	async attemptCompletion(result: string, command?: string): Promise<string> {
		let resultToSend = result;
		if (command) {
			await this.say("completion_result", resultToSend);
			// TODO: currently we don't handle if this command fails, it could be useful to let claude know and retry
			const commandResult = await this.executeCommand(command, true);
			// if we received non-empty string, the command was rejected or failed
			if (commandResult) {
				return commandResult;
			}
			resultToSend = "";
		}
		const { response, text } = await this.ask("completion_result", resultToSend); // this prompts webview to show 'new task' button, and enable text input (which would be the 'text' here)
		if (response === "yesButtonTapped") {
			return "";
		}
		await this.say("user_feedback", text ?? "");
		return `The user is not pleased with the results. Use the feedback they provided to successfully complete the task, and then attempt completion again.\nUser's feedback:\n\"${text}\"`;
	}

	async attemptApiRequest(): Promise<Anthropic.Messages.Message> {
		try {
			const response = await this.client.messages.create(
				{
					model: "claude-3-5-sonnet-20240620", // https://docs.anthropic.com/en/docs/about-claude/models
					// beta max tokens
					max_tokens: 8192,
					system: SYSTEM_PROMPT,
					messages: (await this.providerRef.deref()?.getApiConversationHistory()) || [],
					tools: tools,
					tool_choice: { type: "auto" },
				},
				{
					// https://github.com/anthropics/anthropic-sdk-typescript?tab=readme-ov-file#default-headers
					headers: { "anthropic-beta": "max-tokens-3-5-sonnet-2024-07-15" },
				}
			);
			return response;
		} catch (error) {
			const { response } = await this.ask(
				"api_req_failed",
				error.message ?? JSON.stringify(serializeError(error), null, 2)
			);
			if (response !== "yesButtonTapped") {
				// this will never happen since if noButtonTapped, we will clear current task, aborting this instance
				throw new Error("API request failed");
			}
			await this.say("api_req_retried");
			return this.attemptApiRequest();
		}
	}

	// lihat recursivelyMakeClineRequests
	// di C:\ai\aide\extensions\cline\src\core\Cline.ts
	async recursivelyMakeVsGentRequests(
		userContent: Array<
			| Anthropic.TextBlockParam
			| Anthropic.ImageBlockParam
			| Anthropic.ToolUseBlockParam
			| Anthropic.ToolResultBlockParam
		>
	): Promise<VsGentRequestResult> {
		if (this.abort) {
			throw new Error("VsGentDev instance aborted");
		}

		await this.providerRef.deref()?.addMessageToApiConversationHistory({ role: "user", content: userContent });
		if (this.requestCount >= this.maxRequestsPerTask) {
			const { response } = await this.ask(
				"request_limit_reached",
				`VsGent Dev has reached the maximum number of requests for this task. Would you like to reset the count and allow him to proceed?`
			);

			if (response === "yesButtonTapped") {
				this.requestCount = 0;
			} else {
				await this.providerRef.deref()?.addMessageToApiConversationHistory({
					role: "assistant",
					content: [
						{
							type: "text",
							text: "Failure: I have reached the request limit for this task. Do you have a new task for me?",
						},
					],
				});
				return { didEndLoop: true, inputTokens: 0, outputTokens: 0 };
			}
		}

		// what the user sees in the webview
		await this.say(
			"api_req_started",
			JSON.stringify({
				request: {
					model: "claude-3-5-sonnet-20240620",
					max_tokens: 8192,
					system: "(see SYSTEM_PROMPT in https://github.com/saoudrizwan/claude-dev/blob/main/src/VsGentDev.ts)",
					messages: [{ conversation_history: "..." }, { role: "user", content: userContent }],
					tools: "(see tools in https://github.com/saoudrizwan/claude-dev/blob/main/src/VsGentDev.ts)",
					tool_choice: { type: "auto" },
				},
			})
		);
		try {
			const response = await this.attemptApiRequest();
			this.requestCount++;

			let assistantResponses: Anthropic.Messages.ContentBlock[] = [];
			let inputTokens = response.usage.input_tokens;
			let outputTokens = response.usage.output_tokens;
			await this.say(
				"api_req_finished",
				JSON.stringify({
					tokensIn: inputTokens,
					tokensOut: outputTokens,
					cost: this.calculateApiCost(inputTokens, outputTokens),
				})
			);

			// A response always returns text content blocks (it's just that before we were iterating over the completion_attempt response before we could append text response, resulting in bug)
			for (const contentBlock of response.content) {
				if (contentBlock.type === "text") {
					assistantResponses.push(contentBlock);
					await this.say("text", contentBlock.text);
				}
			}

			let toolResults: Anthropic.ToolResultBlockParam[] = [];
			let attemptCompletionBlock: Anthropic.Messages.ToolUseBlock | undefined;
			for (const contentBlock of response.content) {
				if (contentBlock.type === "tool_use") {
					assistantResponses.push(contentBlock);
					const toolName = contentBlock.name as ToolName;
					const toolInput = contentBlock.input;
					const toolUseId = contentBlock.id;
					if (toolName === "attempt_completion") {
						attemptCompletionBlock = contentBlock;
					} else {
						const result = await this.executeTool(toolName, toolInput);
						// this.say(
						// 	"tool",
						// 	`\nTool Used: ${toolName}\nTool Input: ${JSON.stringify(toolInput)}\nTool Result: ${result}`
						// )
						toolResults.push({ type: "tool_result", tool_use_id: toolUseId, content: result });
					}
				}
			}

			if (assistantResponses.length > 0) {
				await this.providerRef
					.deref()
					?.addMessageToApiConversationHistory({ role: "assistant", content: assistantResponses });
			} else {
				// this should never happen! it there's no assistant_responses, that means we got no text or tool_use content blocks from API which we should assume is an error
				this.say("error", "Unexpected Error: No assistant messages were found in the API response");
				await this.providerRef.deref()?.addMessageToApiConversationHistory({
					role: "assistant",
					content: [{ type: "text", text: "Failure: I did not have a response to provide." }],
				});
			}

			let didEndLoop = false;

			// attempt_completion is always done last, since there might have been other tools that needed to be called first before the job is finished
			// it's important to note that claude will order the tools logically in most cases, so we don't have to think about which tools make sense calling before others
			if (attemptCompletionBlock) {
				let result = await this.executeTool(
					attemptCompletionBlock.name as ToolName,
					attemptCompletionBlock.input
				);
				// this.say(
				// 	"tool",
				// 	`\nattempt_completion Tool Used: ${attemptCompletionBlock.name}\nTool Input: ${JSON.stringify(
				// 		attemptCompletionBlock.input
				// 	)}\nTool Result: ${result}`
				// )
				if (result === "") {
					didEndLoop = true;
					result = "The user is satisfied with the result.";
				}
				toolResults.push({ type: "tool_result", tool_use_id: attemptCompletionBlock.id, content: result });
			}

			if (toolResults.length > 0) {
				if (didEndLoop) {
					await this.providerRef
						.deref()
						?.addMessageToApiConversationHistory({ role: "user", content: toolResults });
					await this.providerRef.deref()?.addMessageToApiConversationHistory({
						role: "assistant",
						content: [
							{
								type: "text",
								text: "I am pleased you are satisfied with the result. Do you have a new task for me?",
							},
						],
					});
				} else {
					const {
						didEndLoop: recDidEndLoop,
						inputTokens: recInputTokens,
						outputTokens: recOutputTokens,
					} = await this.recursivelyMakeVsGentRequests(toolResults);
					didEndLoop = recDidEndLoop;
					inputTokens += recInputTokens;
					outputTokens += recOutputTokens;
				}
			}

			return { didEndLoop, inputTokens, outputTokens };
		} catch (error) {
			// this should never happen since the only thing that can throw an error is the attemptApiRequest, 
			// which is wrapped in a try catch that sends an ask where if noButtonTapped, 
			// will clear current task and destroy this instance.
			// However to avoid unhandled promise rejection, 
			// we will end this loop which will end execution of this instance (see startTask)
			return { didEndLoop: true, inputTokens: 0, outputTokens: 0 };
		}
	}

}
