// type that represents json data that is sent from extension to webview, called ExtensionMessage and has 'type' enum which can be 'plusButtonTapped' or 'settingsButtonTapped' or 'hello'
import { ApiConfiguration, ModelInfo } from "./api"
import { HistoryItem } from "./HistoryItem";
import { McpServer } from "./mcp";

// webview will hold state
export interface ExtensionMessage {
	// type: "action" | "state"
	// text?: string
	// action?: "plusButtonTapped" | "settingsButtonTapped" | "didBecomeVisible"
	// state?: ExtensionState
	type:
		| "action"
		| "state"
		| "selectedImages"
		| "ollamaModels"
		| "lmStudioModels"
		| "theme"
		| "workspaceUpdated"
		| "invoke"
		| "partialMessage"
		| "openRouterModels"
		| "mcpServers"
	text?: string
	action?: 
		| "chatButtonClicked" 
		| "mcpButtonClicked"
		| "settingsButtonClicked" 
		| "historyButtonClicked" 
		| "didBecomeVisible"
	invoke?: "sendMessage" | "primaryButtonClick" | "secondaryButtonClick"
	state?: ExtensionState
	images?: string[]
	ollamaModels?: string[]
	lmStudioModels?: string[]
	filePaths?: string[]
	partialMessage?: VsGentMessage
	openRouterModels?: Record<string, ModelInfo>
	mcpServers?: McpServer[]
}

export interface ExtensionState {
	version: string
	apiConfiguration?: ApiConfiguration
	customInstructions?: string
	alwaysAllowReadOnly?: boolean
	uriScheme?: string
	clineMessages: VsGentMessage[]
	taskHistory: HistoryItem[]
	shouldShowAnnouncement: boolean
	// apiKey?: string
	// maxRequestsPerTask?: number
	// themeName?: string
	// vsGentMessages: VsGentMessage[]
	// shouldShowAnnouncement: boolean
}

export interface VsGentMessage {
	ts: number
	type: "ask" | "say"
	ask?: VsGentAsk
	say?: VsGentSay
	text?: string
	images?: string[]
	partial?: boolean
}

export type VsGentAsk =
	| "followup"
	| "command"
	| "command_output"
	| "completion_result"
	| "tool"
	| "api_req_failed"
	| "resume_task"
	| "resume_completed_task"
	| "mistake_limit_reached"
	| "browser_action_launch"
	| "use_mcp_server"
	// | "request_limit_reached"
	// | "followup"
	// | "command"
	// | "completion_result"
	// | "tool"
	// | "api_req_failed"

export type VsGentSay =
	| "task"
	| "error"
	| "api_req_started"
	| "api_req_finished"
	| "text"
	| "completion_result"
	| "user_feedback"
	| "user_feedback_diff"
	| "api_req_retried"
	| "command_output"
	| "tool"
	| "shell_integration_warning"
	| "browser_action"
	| "browser_action_result"
	| "mcp_server_request_started"
	| "mcp_server_response"
	// | "task"
	// | "error"
	// | "api_req_started"
	// | "api_req_finished"
	// | "text"
	// | "command_output"
	// | "completion_result"
	// | "user_feedback"
	// | "api_req_retried"

export interface VsGentSayTool {
	tool:
		| "editedExistingFile"
		| "newFileCreated"
		| "readFile"
		| "listFilesTopLevel"
		| "listFilesRecursive"
		| "listCodeDefinitionNames"
		| "searchFiles"
	path?: string
	diff?: string
	content?: string
	regex?: string
	filePattern?: string
	// tool: "editedExistingFile" | "newFileCreated" | "readFile" | "listFiles" | "analyzeProject"
	// path?: string
	// diff?: string
	// content?: string
}

// must keep in sync with system prompt
export const browserActions = ["launch", "click", "type", "scroll_down", "scroll_up", "close"] as const
export type BrowserAction = (typeof browserActions)[number]

export interface VsGentSayBrowserAction {
	action: BrowserAction
	coordinate?: string
	text?: string
}

export type BrowserActionResult = {
	screenshot?: string
	logs?: string
	currentUrl?: string
	currentMousePosition?: string
}

export interface VsGentAskUseMcpServer {
	serverName: string
	type: "use_mcp_tool" | "access_mcp_resource"
	toolName?: string
	arguments?: string
	uri?: string
}

export interface VsGentApiReqInfo {
	request?: string
	tokensIn?: number
	tokensOut?: number
	cacheWrites?: number
	cacheReads?: number
	cost?: number
	cancelReason?: VsGentApiReqCancelReason
	streamingFailedMessage?: string
}

export type VsGentApiReqCancelReason = "streaming_failed" | "user_cancelled"
