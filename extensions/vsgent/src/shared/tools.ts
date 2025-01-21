import { Anthropic } from "@anthropic-ai/sdk"

export type ToolName =
	| "write_to_file"
	| "read_file"
	| "analyze_project"
	| "list_files"
	| "execute_command"
	| "ask_followup_question"
	| "attempt_completion"

export type Tool = Omit<Anthropic.Tool, "name"> & {
	name: ToolName
}

export const tools: Tool[] = [
	{
		name: "execute_command",
		description:
			"Execute a CLI command on the system. Use this when you need to perform system operations or run specific commands to accomplish any step in the user's task. You must tailor your command to the user's system and provide a clear explanation of what the command does. Do not run servers or commands that don't terminate on their own. Prefer to execute complex CLI commands over creating executable scripts, as they are more flexible and easier to run.",
		input_schema: {
			type: "object",
			properties: {
				command: {
					type: "string",
					description:
						"The CLI command to execute. This should be valid for the current operating system. Ensure the command is properly formatted and does not contain any harmful instructions. Avoid commands that run indefinitely (like servers) that don't terminate on their own.",
				},
			},
			required: ["command"],
		},
	},
	{
		name: "analyze_project",
		description:
			"Analyze the project structure by listing file paths and parsing supported source code to extract their key elements. This tool provides insights into the codebase structure, focusing on important code constructs like functions, classes, and methods. This also helps to understand the contents and structure of a directory by examining file names and extensions. All this information can guide decision-making on which files to process or explore further.",
		input_schema: {
			type: "object",
			properties: {
				path: {
					type: "string",
					description:
						"The path of the directory to analyze. The tool will recursively scan this directory, list all file paths, and parse supported source code files.",
				},
			},
			required: ["path"],
		},
	},
	{
		name: "list_files",
		description:
			"List all files and directories at the top level of the specified directory. This should only be used for generic directories you don't necessarily need the nested structure of, like the Desktop. If you think you need the nested structure of a directory, use the analyze_project tool instead.",
		input_schema: {
			type: "object",
			properties: {
				path: {
					type: "string",
					description: "The path of the directory to list contents for.",
				},
			},
			required: ["path"],
		},
	},
	{
		name: "read_file",
		description:
			"Read the contents of a file at the specified path. Use this when you need to examine the contents of an existing file, for example to analyze code, review text files, or extract information from configuration files. Be aware that this tool may not be suitable for very large files or binary files, as it returns the raw content as a string.",
		input_schema: {
			type: "object",
			properties: {
				path: {
					type: "string",
					description: "The path of the file to read.",
				},
			},
			required: ["path"],
		},
	},
	{
		name: "write_to_file",
		description:
			"Write content to a file at the specified path. If the file exists, only the necessary changes will be applied. If the file doesn't exist, it will be created. Always provide the full intended content of the file. This tool will automatically create any directories needed to write the file.",
		input_schema: {
			type: "object",
			properties: {
				path: {
					type: "string",
					description: "The path of the file to write to.",
				},
				content: {
					type: "string",
					description: "The full content to write to the file",
				},
			},
			required: ["path", "content"],
		},
	},
	{
		name: "ask_followup_question",
		description:
			"Ask the user a question to gather additional information needed to complete the task. This tool should be used when you encounter ambiguities, need clarification, or require more details to proceed effectively. It allows for interactive problem-solving by enabling direct communication with the user. Use this tool judiciously to maintain a balance between gathering necessary information and avoiding excessive back-and-forth.",
		input_schema: {
			type: "object",
			properties: {
				question: {
					type: "string",
					description:
						"The question to ask the user. This should be a clear, specific question that addresses the information you need.",
				},
			},
			required: ["question"],
		},
	},
	{
		name: "attempt_completion",
		description:
			"Once you've completed the task, use this tool to present the result to the user. They may respond with feedback if they are not satisfied with the result, which you can use to make improvements and try again.",
		input_schema: {
			type: "object",
			properties: {
				command: {
					type: "string",
					description:
						"The CLI command to execute to show a live demo of the result to the user. For example, use 'open -a \"Google Chrome\" index.html' to display a created website. Avoid commands that run indefinitely (like servers) that don't terminate on their own. Instead, if such a command is needed, include instructions for the user to run it in the 'result' parameter.",
				},
				result: {
					type: "string",
					description:
						"The result of the task. Formulate this result in a way that is final and does not require further input from the user. Don't end your result with questions or offers for further assistance.",
				},
			},
			required: ["result"],
		},
	},
]
