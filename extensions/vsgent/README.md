# vsgent README

Activating extension 'codestory-ghost.codestoryai' failed: ENOENT: no such file or directory, unlink 'c:\Users\usef\AppData\Roaming\code-oss-dev\User\globalStorage\codestory-ghost.codestoryai\sidecar_zip.zip'.

## Baca

komunikasi antara webview dan extension
    private setWebviewMessageListener(webview: vscode.Webview) {}

C:\ai\aide\extensions\vsgent\src\providers\vsgent-provider.ts
C:\ai\aide\extensions\vsgent\ui\src\App.tsx
C:\ai\aide\extensions\vsgent\ui\src\components\WelcomeView.tsx

cari: `"apiKey"`

request anthropic
C:\ai\aide\extensions\vsgent\src\vsgent.ts
    constructor: 
        this.client = new Anthropic({ apiKey });
    async attemptApiRequest(): Promise<Anthropic.Messages.Message> { ... }

cari `this.client.`

# contoh yang pernah kita kerjakan
## cline
kalo gak salah di:
i:\aide\extensions\cline
## bolt
kalo gak salah di:
c:\ai\bolt.new

# perbandingkan LLM request
kita ada perbandingan antara

## new cline
C:\ai\aide\extensions\cline\src>grep -r buildApiHandler .
./api/index.ts:export function buildApiHandler(configuration: ApiConfiguration): ApiHandler {
./core/Cline.ts:import { ApiHandler, buildApiHandler } from "../api"
./core/Cline.ts:                this.api = buildApiHandler(apiConfiguration)
./core/webview/ClineProvider.ts:import { buildApiHandler } from "../../api"
./core/webview/ClineProvider.ts:                                                                this.cline.api = buildApiHandler(message.apiConfiguration)
./core/webview/ClineProvider.ts:                        this.cline.api = buildApiHandler({ apiProvider: openrouter, openRouterApiKey: apiKey })

C:\ai\aide\extensions\cline\src\core\Cline.ts

export type ApiStream = AsyncGenerator<ApiStreamChunk>
export type ApiStreamChunk = ApiStreamTextChunk | ApiStreamUsageChunk

export interface ApiStreamTextChunk {
	type: "text"
	text: string
}

export interface ApiStreamUsageChunk {
	type: "usage"
	inputTokens: number
	outputTokens: number
	cacheWriteTokens?: number
	cacheReadTokens?: number
	totalCost?: number // openrouter
}

    this.api = buildApiHandler(apiConfiguration)
	async *attemptApiRequest(previousApiReqIndex: number): ApiStream {
		let systemPrompt = await SYSTEM_PROMPT(cwd, this.api.getModel().info.supportsComputerUse ?? false)
		if (this.customInstructions && this.customInstructions.trim()) {
			// altering the system prompt mid-task will break the prompt cache, but in the grand scheme this will not change often so it's better to not pollute user messages with it the way we have to with <potentially relevant details>
			systemPrompt += addCustomInstructions(this.customInstructions)
		}

		// If the previous API request's total token usage is close to the context window, truncate the conversation history to free up space for the new request
		if (previousApiReqIndex >= 0) {
			const previousRequest = this.clineMessages[previousApiReqIndex]
			if (previousRequest && previousRequest.text) {
				const { tokensIn, tokensOut, cacheWrites, cacheReads }: ClineApiReqInfo = JSON.parse(
					previousRequest.text,
				)
				const totalTokens = (tokensIn || 0) + (tokensOut || 0) + (cacheWrites || 0) + (cacheReads || 0)
				const contextWindow = this.api.getModel().info.contextWindow || 128_000
				const maxAllowedSize = Math.max(contextWindow - 40_000, contextWindow * 0.8)
				if (totalTokens >= maxAllowedSize) {
					const truncatedMessages = truncateHalfConversation(this.apiConversationHistory)
					await this.overwriteApiConversationHistory(truncatedMessages)
				}
			}
		}

		const stream = this.api.createMessage(systemPrompt, this.apiConversationHistory)
		const iterator = stream[Symbol.asyncIterator]()

		try {
			// awaiting first chunk to see if it will throw an error
			const firstChunk = await iterator.next()
			yield firstChunk.value
		} catch (error) {
			// note that this api_req_failed ask is unique in that we only present this option if the api hasn't streamed any content yet (ie it fails on the first chunk due), as it would allow them to hit a retry button. However if the api failed mid-stream, it could be in any arbitrary state where some tools may have executed, so that error is handled differently and requires cancelling the task entirely.
			const { response } = await this.ask(
				"api_req_failed",
				error.message ?? JSON.stringify(serializeError(error), null, 2),
			)
			if (response !== "yesButtonClicked") {
				// this will never happen since if noButtonClicked, we will clear current task, aborting this instance
				throw new Error("API request failed")
			}
			await this.say("api_req_retried")
			// delegate generator output from the recursive call
			yield* this.attemptApiRequest(previousApiReqIndex)
			return
		}

		// no error, so we can continue to yield all remaining chunks
		// (needs to be placed outside of try/catch since it we want caller to handle errors not with api_req_failed as that is reserved for first chunk failures only)
		// this delegates to another generator or iterable object. In this case, it's saying "yield all remaining values from this iterator". This effectively passes along all subsequent chunks from the original stream.
		yield* iterator
	}
C:\ai\aide\extensions\cline\src\api\index.ts
C:\ai\aide\extensions\cline\src\api\providers\openai.ts

## old cline
ini adlh old cline, jadi kita hanya bisa lihat versi anthropic
utk contoh new cline, kita hrs lihat dari C:\ai\aide\extensions\cline
C:\ai\aide\extensions\vsgent\src\vsgent.ts
import { Anthropic } from "@anthropic-ai/sdk";
private client: Anthropic;
this.client = new Anthropic({ apiKey });
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

C:\ai\aide\extensions\cline\src\api\providers\xai.ts
import OpenAI from "openai";
		this.client = new OpenAI({
			apiKey: this.provider.key,
			baseURL: "https://api.x.ai/v1",
		});
		const grokMessages = messages.map((msg) => ({
			role: msg.role,
			content:
				typeof msg.content === "string"
					? msg.content
					: msg.content
						.filter((block) => block.type === "text") // Keep only `TextBlockParam`
						.map((block) => (block as TextBlockParam).text) // Safe type assertion
						.join(""),
		}));
		const result = await this.client.chat.completions.create({
			// model: xaiDefaultModelId,
			model: this.getModel().id,
			messages: [{ role: "system", content: systemPrompt }, ...grokMessages],
		});
		for (const choice of result.choices) {
			yield {
				type: "text",
				text: choice.message.content ?? "",
			}; // as ApiStreamTextChunk;
		}
		yield {
			type: "usage",
			inputTokens: result.usage?.prompt_tokens ?? 0,
			outputTokens: result.usage?.completion_tokens ?? 0,
			totalCost: result.usage
				? ((result.usage.prompt_tokens ?? 0) / 1000) * 5.0 +
				((result.usage.completion_tokens ?? 0) / 1000) * 15.0
				: undefined,
		}; // as ApiStreamUsageChunk;
C:\ai\bolt.new-any-llm\app\lib\.server\llm\openai_server.js
    ini menggunakan axios, bukan openai package

# proses komunikasi
## extension
C:\ai\aide\extensions\vsgent\src\migrations\VsGentProvider.ts
## webview
C:\ai\aide\extensions\vsgent\ui\src\App.tsx
C:\ai\aide\extensions\vsgent\ui\src\context\ExtensionStateContext.tsx
	terutama kita bypass x.ai gak perlu apiKey bisa bypass welcome screen
## alur

### extension => webview

### webview => extension

# logging rame di vscode clone
kita sudah hapus ini sehingga console.log tidak jalan di extension, tapi jalan di webview/react.


# kerjaan kita (dari TODO.md)

## vsgent

## cara bandingkan (biar gak bentrok)
vs I:\vscode\extensions\vsgent\
aide C:\ai\aide\extensions\vsgent

### vsgent v1 (i:\vscode)
I:\vscode\extensions\vsgent\src\extension.js

#### webview ui
I:\vscode\extensions\vsgent\src\vsgent\App.tsx

### vsgent v2 (c:\ai\aide)
C:\ai\aide\extensions\vsgent\src\extension.ts

#### webview ui
C:\ai\aide\extensions\vsgent\ui\src\App.tsx

## cline
I:\vscode\extensions\cline\src\api\providers\hyperbolic.ts
I:\vscode\extensions\cline\src\api\providers\groq.ts
I:\vscode\extensions\cline\src\api\providers\sambanova.ts
I:\vscode\extensions\cline\src\api\providers\xai.ts
I:\vscode\extensions\cline\src\api\providers\gemini.ts
I:\vscode\extensions\cline\src\api\index.ts

I:\vscode\extensions\cline\src\shared\api.ts
I:\vscode\extensions\cline\webview-ui\src\components\settings\ApiOptions.tsx

C:\ai\aide\extensions\vsgent\src\shared\api.ts
C:\ai\aide\extensions\vsgent\ui\src\components\settings\ApiOptions.tsx

## koperasi

## vscode clone
c:\ai\aide
	C:\ai\aide\extensions\vsgent\README.md
c:\ai\fulled
i:\vscode
	I:\vscode\BACA.md
