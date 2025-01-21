import { ApiConfiguration } from "./api"

export interface WebviewMessage {
	type:
		| "apiConfiguration"
		| "customInstructions"
		| "alwaysAllowReadOnly"
		| "webviewDidLaunch"
		| "newTask"
		| "askResponse"
		| "clearTask"
		| "didShowAnnouncement"
		| "selectImages"
		| "exportCurrentTask"
		| "showTaskWithId"
		| "deleteTaskWithId"
		| "exportTaskWithId"
		| "resetState"
		| "requestOllamaModels"
		| "requestLmStudioModels"
		| "openImage"
		| "openFile"
		| "openMention"
		| "cancelTask"
		| "refreshOpenRouterModels"
		| "openMcpSettings"
		| "restartMcpServer"
	text?: string
	askResponse?: VsGentAskResponse
	apiConfiguration?: ApiConfiguration
	images?: string[]
	bool?: boolean
	// type:
	// 	| "apiKey"
	// 	| "maxRequestsPerTask"
	// 	| "webviewDidLaunch"
	// 	| "newTask"
	// 	| "askResponse"
	// 	| "clearTask"
	// 	| "didShowAnnouncement"
	// text?: string
	// askResponse?: VsGentAskResponse
}

// export type VsGentAskResponse = "yesButtonTapped" | "noButtonTapped" | "textResponse"
export type VsGentAskResponse = "yesButtonClicked" | "noButtonClicked" | "messageResponse"