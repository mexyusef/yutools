/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as dom from '../../../../base/browser/dom.js';
import { ITreeContextMenuEvent, ITreeElement } from '../../../../base/browser/ui/tree/tree.js';
import { disposableTimeout, timeout } from '../../../../base/common/async.js';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { toErrorMessage } from '../../../../base/common/errorMessage.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { MarkdownString } from '../../../../base/common/htmlContent.js';
import { Disposable, DisposableStore, IDisposable, MutableDisposable, combinedDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../base/common/network.js';
import { extUri, isEqual } from '../../../../base/common/resources.js';
import { isDefined } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import { ICodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { MenuId } from '../../../../platform/actions/common/actions.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { ITextResourceEditorInput } from '../../../../platform/editor/common/editor.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ServiceCollection } from '../../../../platform/instantiation/common/serviceCollection.js';
import { WorkbenchObjectTree } from '../../../../platform/list/browser/listService.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IRequestService } from '../../../../platform/request/common/request.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
// import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { ChatAgentLocation, IAideAgentAgentService, IChatAgentCommand, IChatAgentData } from '../common/aideAgentAgents.js';
import { IAideAgentCodeEditingService } from '../common/aideAgentCodeEditingService.js';
import { CONTEXT_AIDE_PLAN_INPUT, CONTEXT_AIDE_PLAN_REVIEW_STATE_EXCHANGEID, CONTEXT_AIDE_PLAN_REVIEW_STATE_SESSIONID, CONTEXT_CHAT_IN_PASSTHROUGH_WIDGET, CONTEXT_CHAT_INPUT_HAS_AGENT, CONTEXT_CHAT_LOCATION, CONTEXT_CHAT_REQUEST_IN_PROGRESS, CONTEXT_IN_CHAT_RESPONSE_WITH_PLAN_STEPS, CONTEXT_IN_CHAT_SESSION, CONTEXT_PARTICIPANT_SUPPORTS_MODEL_PICKER, CONTEXT_RESPONSE_FILTERED, CONTEXT_STREAMING_STATE } from '../common/aideAgentContextKeys.js';
import {
	AgentMode, AgentScope, ChatModelInitState, IChatModel,
	IChatProgressResponseContent,
	IChatRequestVariableEntry, IChatResponseModel
} from '../common/aideAgentModel.js';
import {
	ChatRequestAgentPart,
	IParsedChatRequest,
	chatAgentLeader,
	chatSubcommandLeader,
	// formatChatQuestion
} from '../common/aideAgentParserTypes.js';
import { ChatRequestParser } from '../common/aideAgentRequestParser.js';
import { ChatEditsState, ChatPlanState, IAideAgentService, IChatAideAgentPlanRegenerateInformationPart, IChatEditsInfo, IChatFollowup, IChatLocationData, IChatPlanInfo } from '../common/aideAgentService.js';
import { IAideAgentSlashCommandService } from '../common/aideAgentSlashCommands.js';
import { ChatViewModel, IChatResponseViewModel, isRequestVM, isResponseVM, isWelcomeVM } from '../common/aideAgentViewModel.js';
import { CodeBlockModelCollection } from '../common/codeBlockModelCollection.js';
import { ChatTreeItem, IAideAgentAccessibilityService, IAideAgentWidgetService, IChatCodeBlockInfo, IChatFileTreeInfo, IChatListItemRendererOptions, IChatPlanStepsInfo, IChatWidget, IChatWidgetViewContext, IChatWidgetViewOptions, showChatView, TreeUser } from './aideAgent.js';
import { ChatAccessibilityProvider } from './aideAgentAccessibilityProvider.js';
import { ChatInputPart } from './aideAgentInputPart.js';
import { ChatListDelegate, ChatListItemRenderer, IChatRendererDelegate } from './aideAgentListRenderer.js';
import { ChatEditorOptions } from './aideAgentOptions.js';
import './media/aideAgent.css';

export interface LLMProviderKey {
	name: string; // Required
	key: string;  // Required
	settings?: {
		temperature?: number;
		maxTokens?: number;
		topP?: number;
		frequencyPenalty?: number;
		presencePenalty?: number;
	};
	baseUrl?: string;
	model?: string;
	uses?: number;
}

type LLMProviderKeys = LLMProviderKey[];

async function loadKeysFromFile(
	fileService: IFileService,
	configFile: string
): Promise<LLMProviderKeys> {
	console.log(`		loadKeysFromFile #1.`);
	const fileUri = URI.file(configFile);
	console.log(`		loadKeysFromFile #2.`);
	const fileContent = await fileService.readFile(fileUri);
	console.log(`		loadKeysFromFile #3: fileContent = ${fileContent}`);
	return JSON.parse(fileContent.value.toString());
}

async function getNextProvider(
	fileService: IFileService,
	configFile: string
): Promise<LLMProviderKey> {
	console.log(`getNextProvider #1.`);
	const USE_LLM_PROVIDER_KEYS = await loadKeysFromFile(fileService, configFile);
	console.log(`getNextProvider #2.`);
	if (USE_LLM_PROVIDER_KEYS === null || !USE_LLM_PROVIDER_KEYS.length) {
		throw new Error('No providers found in apiKeys.ts');
	}
	console.log(`getNextProvider #3.`);
	USE_LLM_PROVIDER_KEYS.forEach((p: any) => {
		if (p.uses === undefined) {
			p.uses = 0;
		}
	});
	console.log(`getNextProvider #4.`);
	const minUses = Math.min(...USE_LLM_PROVIDER_KEYS.map((p) => p.uses ?? 0));
	const leastUsedProviders = USE_LLM_PROVIDER_KEYS.filter((p) => p.uses === minUses);
	const selectedProvider = leastUsedProviders[Math.floor(Math.random() * leastUsedProviders.length)];
	console.log(`getNextProvider #5.`);
	selectedProvider.uses = (selectedProvider.uses ?? 0) + 1;
	console.log(`getNextProvider #6 => ${JSON.stringify(selectedProvider)}`);
	return selectedProvider;
}

export class GeminiClientSingleton {
	// private apiKey: string;
	private apiKeyFile: string;

	public static async create(fileService: IFileService, requestService: IRequestService): Promise<GeminiClientSingleton> {
		// const apiKeyFile = "c:/users/usef/GOOGLE_GEMINI_API_KEYS.json";
		// const apiKey = await readApiKeyFileAndGetKey(fileService, apiKeyFile);
		return new GeminiClientSingleton(fileService, requestService);
	}

	constructor(
		@IFileService private readonly fileService: IFileService,
		// apiKey: string,
		@IRequestService private readonly requestService: IRequestService,
	) {
		this.apiKeyFile = "c:/users/usef/GOOGLE_GEMINI_API_KEYS.json";
		// this.apiKey = apiKey;
		// this.model = new GoogleGenerativeAI(this.apiKey).getGenerativeModel({
		// 	model: "gemini-2.0-flash-exp",
		// });
		console.log(`
			agent GeminiClientSingleton
			this.apiKeyFile = ${this.apiKeyFile}
			this.fileService = ${this.fileService}
		`);
	}

	private async makeRequest(prompt: string, files?: { data: Buffer; mimeType: string }[]): Promise<any> {
		const apiKey = await getNextProvider(this.fileService, this.apiKeyFile);
		// https://ai.google.dev/gemini-api/docs/models/experimental-models
		// const model = 'gemini-1.5-flash';
		// const model = 'gemini-2.0-flash-thinking-exp-1219';
		// const model = 'gemini-exp-1206';
		const model = 'gemini-2.0-flash-exp';
		const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.key}`;
		const headers = {
			'Content-Type': 'application/json',
		};

		const contents = [{
			parts: [
				{ text: prompt },
				...(files ? files.map(file => ({
					inlineData: {
						data: file.data.toString('base64'),
						mimeType: file.mimeType,
					},
				})) : []),
			],
		}];

		const data = {
			contents,
		};

		const options = {
			type: 'POST',
			url,
			data: JSON.stringify(data),
			headers,
		};
		console.log(`
			agent GeminiClientSingleton
			apiKey = ${apiKey}
			prompt = ${prompt}
		`);
		const tokenSource = new CancellationTokenSource();
		try {
			const response = await this.requestService.request(options, tokenSource.token);

			// Convert VSBufferReadableStream to a string
			const chunks: string[] = [];
			await new Promise<void>((resolve, reject) => {
				response.stream.on('data', (chunk: VSBuffer) => {
					chunks.push(chunk.toString());
				});
				response.stream.on('error', reject);
				response.stream.on('end', resolve);
			});

			const responseText = chunks.join('');
			const hasil = JSON.parse(responseText);
			console.log(`
				agent GeminiClientSingleton
				responseText = ${responseText}
				hasil = ${JSON.stringify(hasil)}
			`);
			return hasil;
		} catch (error) {
			console.error('Error making request to Gemini API:', error);
			throw error;
		} finally {
			tokenSource.dispose();
		}
	}

	async generateText(prompt: string): Promise<string> {
		const response = await this.makeRequest(prompt);
		return response.candidates[0].content.parts[0].text;
	}

	async generateTextStream(prompt: string, onChunk: (chunk: string) => void): Promise<void> {
		const response = await this.makeRequest(prompt);
		const text = response.candidates[0].content.parts[0].text;
		onChunk(text);
	}

	async generateMultimodal(prompt: string, files: { data: Buffer; mimeType: string }[]): Promise<string> {
		const response = await this.makeRequest(prompt, files);
		return response.candidates[0].content.parts[0].text;
	}



}

const $ = dom.$;

function revealLastElement(list: WorkbenchObjectTree<any>) {
	list.scrollTop = list.scrollHeight - list.renderHeight;
}

export type IChatInputState = Record<string, any>;

export interface IChatViewState {
	inputValue?: string;
	inputState?: IChatInputState;
}

export interface IChatWidgetStyles {
	listForeground: string;
	listBackground: string;
	overlayBackground: string;
	inputEditorBackground: string;
	resultEditorBackground: string;
}

export interface IChatWidgetContrib extends IDisposable {
	readonly id: string;

	/**
	 * A piece of state which is related to the input editor of the chat widget
	 */
	getInputState?(): any;

	/**
	 * Called with the result of getInputState when navigating input history.
	 */
	setInputState?(s: any): void;
}

export interface IChatWidgetLocationOptions {
	location: ChatAgentLocation;
	resolveData?(): IChatLocationData | undefined;
}

export type IChatWidgetCompletionContext = 'default' | 'files' | 'code';

export class ChatWidget extends Disposable implements IChatWidget {
	public static readonly CONTRIBS: { new(...args: [IChatWidget, ...any]): IChatWidgetContrib }[] = [];

	private readonly _onDidSubmitAgent = this._register(new Emitter<{ agent: IChatAgentData; slashCommand?: IChatAgentCommand }>());
	public readonly onDidSubmitAgent = this._onDidSubmitAgent.event;

	private _onDidChangeAgent = this._register(new Emitter<{ agent: IChatAgentData; slashCommand?: IChatAgentCommand }>());
	readonly onDidChangeAgent = this._onDidChangeAgent.event;

	private _onDidFocus = this._register(new Emitter<void>());
	readonly onDidFocus = this._onDidFocus.event;

	private _onDidChangeViewModel = this._register(new Emitter<void>());
	readonly onDidChangeViewModel = this._onDidChangeViewModel.event;

	private _onDidScroll = this._register(new Emitter<void>());
	readonly onDidScroll = this._onDidScroll.event;

	private _onDidClear = this._register(new Emitter<void>());
	readonly onDidClear = this._onDidClear.event;

	private _onDidAcceptInput = this._register(new Emitter<void>());
	readonly onDidAcceptInput = this._onDidAcceptInput.event;

	private _onDidChangeContext = this._register(new Emitter<{ removed?: IChatRequestVariableEntry[]; added?: IChatRequestVariableEntry[] }>());
	readonly onDidChangeContext = this._onDidChangeContext.event;

	private _onDidHide = this._register(new Emitter<void>());
	readonly onDidHide = this._onDidHide.event;

	private _onDidChangeParsedInput = this._register(new Emitter<void>());
	readonly onDidChangeParsedInput = this._onDidChangeParsedInput.event;

	private readonly _onWillMaybeChangeHeight = new Emitter<void>();
	readonly onWillMaybeChangeHeight: Event<void> = this._onWillMaybeChangeHeight.event;

	private _onDidChangeHeight = this._register(new Emitter<number>());
	readonly onDidChangeHeight = this._onDidChangeHeight.event;

	private readonly _onDidChangeContentHeight = new Emitter<void>();
	readonly onDidChangeContentHeight: Event<void> = this._onDidChangeContentHeight.event;

	private contribs: ReadonlyArray<IChatWidgetContrib> = [];

	private tree!: WorkbenchObjectTree<ChatTreeItem>;
	private renderer!: ChatListItemRenderer;
	private readonly _codeBlockModelCollection: CodeBlockModelCollection;

	inputPart!: ChatInputPart;
	private editorOptions!: ChatEditorOptions;

	private listContainer!: HTMLElement;
	private container!: HTMLElement;

	private bodyDimension: dom.Dimension | undefined;
	private visibleChangeCount = 0;
	private requestInProgress: IContextKey<boolean>;
	private agentInInput: IContextKey<boolean>;
	private agentSupportsModelPicker: IContextKey<boolean>;
	private inChatResponseWithPlanSteps: IContextKey<boolean>;
	private isIterationAllowed: IContextKey<boolean>;

	private _runningSessionId: IContextKey<string | undefined>;
	get runningSessionId(): string | undefined {
		return this._runningSessionId.get();
	}

	private _runningExchangeId: IContextKey<string | undefined>;
	get runningExchangeId(): string | undefined {
		return this._runningExchangeId.get();
	}

	private _visible = false;
	public get visible() {
		return this._visible;
	}

	private previousTreeScrollHeight: number = 0;

	private readonly viewModelDisposables = this._register(new DisposableStore());
	private _viewModel: ChatViewModel | undefined;
	private set viewModel(viewModel: ChatViewModel | undefined) {
		if (this._viewModel === viewModel) {
			return;
		}

		this.viewModelDisposables.clear();

		this._viewModel = viewModel;
		if (viewModel) {
			this.viewModelDisposables.add(viewModel);
		}

		this._onDidChangeViewModel.fire();
	}

	get viewModel() {
		return this._viewModel;
	}

	private parsedChatRequest: IParsedChatRequest | undefined;
	get parsedInput() {
		if (this.parsedChatRequest === undefined) {
			this.parsedChatRequest = this.instantiationService
				.createInstance(ChatRequestParser)
				.parseChatRequest(
					this.viewModel!.sessionId,
					this.getInput(),
					this.location,
					{ selectedAgent: this._lastSelectedAgent }
				);
		}

		return this.parsedChatRequest;
	}
	// get parsedInput() {
	// 	if (!this.viewModel) {
	// 		// Return a default or empty parsed request if viewModel is undefined
	// 		return {
	// 			parts: [],
	// 			sessionId: '',
	// 			location: this.location,
	// 			selectedAgent: this._lastSelectedAgent,
	// 		};
	// 	}

	// 	if (this.parsedChatRequest === undefined) {
	// 		this.parsedChatRequest = this.instantiationService.createInstance(ChatRequestParser).parseChatRequest(
	// 			this.viewModel.sessionId,
	// 			this.getInput(),
	// 			this.location,
	// 			{ selectedAgent: this._lastSelectedAgent }
	// 		);
	// 	}
	// 	return this.parsedChatRequest;
	// }

	get scopedContextKeyService(): IContextKeyService {
		return this.contextKeyService;
	}

	private readonly _location: IChatWidgetLocationOptions;

	get location() {
		return this._location.location;
	}

	readonly viewContext: IChatWidgetViewContext;

	constructor(
		location: ChatAgentLocation | IChatWidgetLocationOptions,
		_viewContext: IChatWidgetViewContext | undefined,
		private readonly viewOptions: IChatWidgetViewOptions,
		private readonly styles: IChatWidgetStyles,
		@ICodeEditorService private readonly codeEditorService: ICodeEditorService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IAideAgentService private readonly chatService: IAideAgentService,
		@IAideAgentAgentService private readonly chatAgentService: IAideAgentAgentService,
		@IAideAgentCodeEditingService private readonly aideAgentCodeEditingService: IAideAgentCodeEditingService,
		@IAideAgentWidgetService chatWidgetService: IAideAgentWidgetService,
		@IContextMenuService private readonly contextMenuService: IContextMenuService,
		@IAideAgentAccessibilityService private readonly chatAccessibilityService: IAideAgentAccessibilityService,
		@ILogService private readonly logService: ILogService,
		@IThemeService private readonly themeService: IThemeService,
		@IAideAgentSlashCommandService private readonly chatSlashCommandService: IAideAgentSlashCommandService,
		@IViewsService private readonly viewsService: IViewsService,
		// TAMBAHAN
		// @IEditorService private readonly editorService: IEditorService,
		@IRequestService private readonly requestService: IRequestService,
		@IFileService private readonly fileService: IFileService,
	) {
		super();

		this.viewContext = _viewContext ?? {};

		if (typeof location === 'object') {
			this._location = location;
		} else {
			this._location = { location };
		}

		CONTEXT_CHAT_IN_PASSTHROUGH_WIDGET.bindTo(contextKeyService).set('isPassthrough' in this.viewContext && this.viewContext.isPassthrough);
		CONTEXT_IN_CHAT_SESSION.bindTo(contextKeyService).set(true);
		CONTEXT_CHAT_LOCATION.bindTo(contextKeyService).set(this._location.location);

		this.agentInInput = CONTEXT_CHAT_INPUT_HAS_AGENT.bindTo(contextKeyService);
		this.agentSupportsModelPicker = CONTEXT_PARTICIPANT_SUPPORTS_MODEL_PICKER.bindTo(contextKeyService);
		this.inChatResponseWithPlanSteps = CONTEXT_IN_CHAT_RESPONSE_WITH_PLAN_STEPS.bindTo(this.contextKeyService);
		this._runningSessionId = CONTEXT_AIDE_PLAN_REVIEW_STATE_SESSIONID.bindTo(this.contextKeyService);
		this._runningExchangeId = CONTEXT_AIDE_PLAN_REVIEW_STATE_EXCHANGEID.bindTo(this.contextKeyService);
		this.requestInProgress = CONTEXT_CHAT_REQUEST_IN_PROGRESS.bindTo(contextKeyService);
		this.isIterationAllowed = CONTEXT_AIDE_PLAN_INPUT.bindTo(contextKeyService);

		this._register((chatWidgetService as ChatWidgetService).register(this));

		this._codeBlockModelCollection = this._register(instantiationService.createInstance(CodeBlockModelCollection));

		this._register(codeEditorService.registerCodeEditorOpenHandler(async (input: ITextResourceEditorInput, _source: ICodeEditor | null, _sideBySide?: boolean): Promise<ICodeEditor | null> => {
			const resource = input.resource;
			if (resource.scheme !== Schemas.vscodeAideAgentCodeBlock) {
				return null;
			}

			const responseId = resource.path.split('/').at(1);
			if (!responseId) {
				return null;
			}

			const item = this.viewModel?.getItems().find(item => item.id === responseId);
			if (!item) {
				return null;
			}

			// TODO: needs to reveal the chat view

			this.reveal(item);

			await timeout(0); // wait for list to actually render

			for (const codeBlockPart of this.renderer.editorsInUse()) {
				if (extUri.isEqual(codeBlockPart.uri, resource, true)) {
					const editor = codeBlockPart.editor;

					let relativeTop = 0;
					const editorDomNode = editor.getDomNode();
					if (editorDomNode) {
						const row = dom.findParentWithClass(editorDomNode, 'monaco-list-row');
						if (row) {
							relativeTop = dom.getTopLeftOffset(editorDomNode).top - dom.getTopLeftOffset(row).top;
						}
					}

					if (input.options?.selection) {
						const editorSelectionTopOffset = editor.getTopForPosition(input.options.selection.startLineNumber, input.options.selection.startColumn);
						relativeTop += editorSelectionTopOffset;

						editor.focus();
						editor.setSelection({
							startLineNumber: input.options.selection.startLineNumber,
							startColumn: input.options.selection.startColumn,
							endLineNumber: input.options.selection.endLineNumber ?? input.options.selection.startLineNumber,
							endColumn: input.options.selection.endColumn ?? input.options.selection.startColumn
						});
					}

					this.reveal(item, relativeTop);

					return editor;
				}
			}
			return null;
		}));

		console.log(`
			${this.isIterationAllowed}
			${this.codeEditorService}
			${this.chatAccessibilityService}
		`);

	}

	// private async _acceptInput(opts: { query: string; mode: AgentMode } | { prefix: string } | undefined): Promise<IChatResponseModel | undefined> {
	// 	if (this.viewModel) {
	// 		const editorValue = this.getInput();
	// 		if ('isPassthrough' in this.viewContext && this.viewContext.isPassthrough) {
	// 			const widget = await showChatView(this.viewsService);
	// 			if (!widget?.viewModel || !this.viewModel) {
	// 				return;
	// 			}

	// 			widget.transferQueryState(AgentMode.Edit, this.inputPart.currentAgentScope);
	// 			widget.acceptInput(AgentMode.Edit, editorValue);
	// 			widget.focusInput();
	// 			this._onDidAcceptInput.fire();
	// 			return;
	// 		}

	// 		this._onDidAcceptInput.fire();
	// 		const requestId = this.chatAccessibilityService.acceptRequest();

	// 		// Determine the input value based on the options (e.g., query, prefix, or raw editor value)
	// 		const input = !opts ? editorValue :
	// 			'query' in opts ? opts.query :
	// 				`${opts.prefix} ${editorValue}`;
	// 		const isUserQuery = !opts || 'prefix' in opts;

	// 		let agentMode = AgentMode.Chat;
	// 		if (opts && 'mode' in opts) {
	// 			agentMode = opts.mode;
	// 		}

	// 		if (agentMode === AgentMode.Edit || agentMode === AgentMode.Plan) {
	// 			this.isIterationAllowed.set(true);
	// 		} else {
	// 			this.isIterationAllowed.set(false);
	// 		}

	// 		// This is also tied to just the edit and to nothing else right now
	// 		// which kind of feels weird ngl
	// 		let agentScope = this.inputPart.currentAgentScope;
	// 		// If we are inPassthrough which implies a floating widget then
	// 		// our scope is always Selection
	// 		if ('isPassthrough' in this.viewContext && this.viewContext.isPassthrough) {
	// 			agentScope = AgentScope.Selection;
	// 		}
	// 		// scope here is dicated by how the command is run, not on the internal state
	// 		// of the inputPart which was based on a selector before
	// 		const result = await this.chatService.sendRequest(this.viewModel.sessionId, input, {
	// 			agentMode,
	// 			agentScope: agentScope,
	// 			userSelectedModelId: this.inputPart.currentLanguageModel,
	// 			location: this.location,
	// 			locationData: this._location.resolveData?.(),
	// 			parserContext: { selectedAgent: this._lastSelectedAgent },
	// 			attachedContext: [...this.inputPart.attachedContext.values()]
	// 		});

	// 		if (result) {
	// 			this.inputPart.acceptInput(isUserQuery);
	// 			this._onDidSubmitAgent.fire({ agent: result.agent, slashCommand: result.slashCommand });
	// 			result.responseCompletePromise.then(() => {
	// 				const responses = this.viewModel?.getItems().filter(isResponseVM);
	// 				const lastResponse = responses?.[responses.length - 1];
	// 				this.chatAccessibilityService.acceptResponse(lastResponse, requestId);
	// 				if (lastResponse?.result?.nextQuestion) {
	// 					const { prompt, participant, command } = lastResponse.result.nextQuestion;
	// 					const question = formatChatQuestion(this.chatAgentService, this.location, prompt, participant, command);
	// 					if (question) {
	// 						this.input.setValue(question, false);
	// 					}
	// 				}
	// 			});
	// 			return result.responseCreatedPromise;
	// 		}
	// 	}
	// 	return undefined;
	// }
	// TAMBAHAN
	// private async _acceptInput(opts: { query: string; mode: AgentMode } | { prefix: string } | undefined): Promise<void> {
	private async _acceptInput(opts: { query: string; mode: AgentMode } | { prefix: string } | undefined): Promise<IChatResponseModel | undefined> {
		const editorValue = this.getInput(); // Get the value from the input editor

		// Handle passthrough mode (e.g., floating widget)
		if ('isPassthrough' in this.viewContext && this.viewContext.isPassthrough) {
			const widget = await showChatView(this.viewsService);
			if (!widget) {
				// return;
				return undefined; // Return undefined if no widget is found
			}

			widget.transferQueryState(AgentMode.Edit, this.inputPart.currentAgentScope);
			widget.acceptInput(AgentMode.Edit, editorValue);
			widget.focusInput();
			this._onDidAcceptInput.fire();
			// return;
			return undefined; // Return undefined since no response model is created
		}

		this._onDidAcceptInput.fire(); // Fire an event indicating input was accepted

		// Determine the input value based on the options (e.g., query, prefix, or raw editor value)
		const input = !opts ? editorValue :
			'query' in opts ? opts.query :
				`${opts.prefix} ${editorValue}`;

		// Send the request to Gemini
		try {
			const gemini = await GeminiClientSingleton.create(this.fileService, this.requestService);
			const geminiResponse = await gemini.generateText(input); // Generate response using Gemini

			// Insert the response into the active editor or create a new untitled one
			await this.executeInsertTextCommand(geminiResponse);

			const responseContent: IChatProgressResponseContent[] = [
				{
					kind: 'markdownContent',
					content: new MarkdownString(geminiResponse),
				},
			];
			// Ensure viewModel and its model are defined
			if (!this.viewModel?.model) {
				throw new Error('ViewModel or its model is not defined.');
			}

			// Return a dummy response model (you may need to adapt this to match your IChatResponseModel interface)
			const responseModel: IChatResponseModel = {
				id: 'gemini-response', // Generate a unique ID
				// response: { value: geminiResponse },
				response: {
					value: responseContent, // Use the converted response
					toMarkdown: () => geminiResponse,
					toString: () => geminiResponse,
				},
				isComplete: true,
				// Add other required properties based on your IChatResponseModel interface
				onDidChange: new Emitter<void>().event, // Add a dummy event emitter
				isUserResponse: false,
				username: 'Gemini',
				// session: this.viewModel?.model, // Assuming this.viewModel is the current session
				session: this.viewModel.model, // Now guaranteed to be defined
				usedContext: undefined,
				contentReferences: [],
				editsInfo: undefined,
				planInfo: undefined,
				streamingState: undefined,
				codeCitations: [],
				codeEdits: undefined,
				progressMessages: [],
				isCanceled: false,
				isStale: false,
				vote: undefined,
				voteDownReason: undefined,
				setVote: () => { },
				setVoteDownReason: () => { },
				setEditApplied: () => false,
				// Add the missing properties
				agentOrSlashCommandDetected: false, // Set to false by default
				planExchangeId: null, // Set to null by default
				planSessionId: null, // Set to null by default
			};

			return responseModel; // Return the response model


		} catch (error) {
			console.error('Failed to process input with Gemini:', error);
			console.log('Failed to process input with Gemini. Please try again.');
			return undefined; // Return undefined in case of an error
		}
	}
	private async executeInsertTextCommand(text: string): Promise<void> {
		// Execute the command to insert text at the cursor
		await this.instantiationService.invokeFunction(async (accessor) => {
			const commandService = accessor.get(ICommandService);
			await commandService.executeCommand('yutools.editor_insert_text_at_cursor', text);
		});
	}
	// private async insertResponseIntoEditor(response: string): Promise<void> {
	// 	const activeEditor = this.codeEditorService.getActiveCodeEditor();
	// 	if (activeEditor) {
	// 		// Insert the response at the current cursor position
	// 		const position = activeEditor.getPosition();
	// 		if (position) {
	// 			activeEditor.executeEdits('gemini-response', [{ range: new Range(position.lineNumber, position.column, position.lineNumber, position.column), text: response }]);
	// 		}
	// 	} else {
	// 		// If there's no active editor, create a new untitled document and insert the response
	// 		const uri = URI.from({ scheme: 'untitled', path: 'gemini-response.md' });
	// 		const editor = await this.codeEditorService.openCodeEditor({ resource: uri }, undefined);
	// 		if (editor) {
	// 			editor.setValue(response);
	// 		}
	// 	}
	// }
	// private async _acceptInput(opts: { query: string; mode: AgentMode } | { prefix: string } | undefined): Promise<IChatResponseModel | undefined> {
	// 	if (this.viewModel) {
	// 		const editorValue = this.getInput(); // Get the value from the input editor

	// 		// Handle passthrough mode (e.g., floating widget)
	// 		if ('isPassthrough' in this.viewContext && this.viewContext.isPassthrough) {
	// 			const widget = await showChatView(this.viewsService);
	// 			if (!widget?.viewModel || !this.viewModel) {
	// 				return;
	// 			}

	// 			widget.transferQueryState(AgentMode.Edit, this.inputPart.currentAgentScope);
	// 			widget.acceptInput(AgentMode.Edit, editorValue);
	// 			widget.focusInput();
	// 			this._onDidAcceptInput.fire();
	// 			return;
	// 		}

	// 		this._onDidAcceptInput.fire(); // Fire an event indicating input was accepted
	// 		const requestId = this.chatAccessibilityService.acceptRequest();

	// 		// Determine the input value based on the options (e.g., query, prefix, or raw editor value)
	// 		const input = !opts ? editorValue :
	// 			'query' in opts ? opts.query :
	// 				`${opts.prefix} ${editorValue}`;

	// 		// const isUserQuery = !opts || 'prefix' in opts;

	// 		// Send the request to Gemini
	// 		try {
	// 			const gemini = await GeminiClientSingleton.create(this.fileService, this.requestService);
	// 			const geminiResponse = await gemini.generateText(input); // Generate response using Gemini

	// 			// // Insert the response into the active editor or create a new untitled one
	// 			// await this.insertResponseIntoEditor(geminiResponse);

	// 			// // Simulate a response model (you may need to adapt this to match your IChatResponseModel interface)
	// 			// const responseModel: IChatResponseModel = {
	// 			// 	id: 'gemini-response', // Generate a unique ID
	// 			// 	response: { value: geminiResponse },
	// 			// 	isComplete: true,
	// 			// 	// Add other required properties based on your IChatResponseModel interface
	// 			// };
	// 			// Convert the Gemini response into the expected format
	// 			const responseContent: IChatProgressResponseContent[] = [
	// 				{
	// 					kind: 'markdownContent',
	// 					content: new MarkdownString(geminiResponse),
	// 				},
	// 			];

	// 			// Create the response model
	// 			const responseModel: IChatResponseModel = {
	// 				id: 'gemini-response', // Generate a unique ID
	// 				response: { value: responseContent, toMarkdown: () => geminiResponse, toString: () => geminiResponse },
	// 				isComplete: true,
	// 				// Add other required properties based on your IChatResponseModel interface
	// 				onDidChange: new Emitter<void>().event, // Add a dummy event emitter
	// 				isUserResponse: false,
	// 				username: 'Gemini',
	// 				session: this.viewModel.model, // Assuming this.viewModel is the current session
	// 				usedContext: undefined,
	// 				contentReferences: [],
	// 				editsInfo: undefined,
	// 				planInfo: undefined,
	// 				streamingState: undefined,
	// 				codeCitations: [],
	// 				codeEdits: undefined,
	// 				progressMessages: [],
	// 				isCanceled: false,
	// 				isStale: false,
	// 				vote: undefined,
	// 				voteDownReason: undefined,
	// 				setVote: () => { },
	// 				setVoteDownReason: () => { },
	// 				setEditApplied: () => false,
	// 				// Add the missing properties
	// 				agentOrSlashCommandDetected: false, // Set to false by default
	// 				planExchangeId: null, // Set to null by default
	// 				planSessionId: null, // Set to null by default
	// 			};


	// 			// // Add the response to the chat widget
	// 			// this.viewModel.onAddResponse(responseModel);

	// 			// // Handle accessibility and follow-up questions
	// 			// this.chatAccessibilityService.acceptResponse(responseModel, requestId);
	// 			// Add the response to the chat widget
	// 			this.viewModel.onAddResponse(responseModel);

	// 			// Retrieve the response view model from the chat view model
	// 			const responseViewModel = this.viewModel.getItems().find(item => isResponseVM(item) && item.id === responseModel.id) as IChatResponseViewModel | undefined;

	// 			if (responseViewModel) {
	// 				// Handle accessibility and follow-up questions
	// 				this.chatAccessibilityService.acceptResponse(responseViewModel, requestId);
	// 			}

	// 			// If the response includes a follow-up question, set it in the input
	// 			if (geminiResponse.includes('?')) { // Simple heuristic for follow-up questions
	// 				this.input.setValue(geminiResponse, false);
	// 			}

	// 			return responseModel;
	// 		} catch (error) {
	// 			console.error('Failed to process input with Gemini:', error);


	// 			// Convert the error message into an IMarkdownString
	// 			const errorMarkdownResponse = new MarkdownString('Failed to get a response from Gemini.');

	// 			// Create an error response model
	// 			const errorResponseModel: IChatResponseModel = {
	// 				id: 'error-response',
	// 				response: {
	// 					value: [
	// 						{
	// 							kind: 'markdownContent', // Use the correct kind for markdown content
	// 							content: errorMarkdownResponse, // Use the IMarkdownString
	// 						},
	// 					],
	// 					toMarkdown: () => 'Failed to get a response from Gemini.',
	// 					toString: () => 'Failed to get a response from Gemini.',
	// 				},
	// 				isComplete: true,
	// 				// Add other required properties based on your IChatResponseModel interface
	// 				onDidChange: new Emitter<void>().event, // Add a dummy event emitter
	// 				isUserResponse: false,
	// 				username: 'System',
	// 				session: this.viewModel.model, // Use the correct IChatModel instance
	// 				usedContext: undefined,
	// 				contentReferences: [],
	// 				editsInfo: undefined,
	// 				planInfo: undefined,
	// 				streamingState: undefined,
	// 				codeCitations: [],
	// 				codeEdits: undefined,
	// 				progressMessages: [],
	// 				isCanceled: false,
	// 				isStale: false,
	// 				vote: undefined,
	// 				voteDownReason: undefined,
	// 				setVote: () => { },
	// 				setVoteDownReason: () => { },
	// 				setEditApplied: () => false,

	// 				// Add the missing properties
	// 				agentOrSlashCommandDetected: false, // Set to false by default
	// 				planExchangeId: null, // Set to null by default
	// 				planSessionId: null, // Set to null by default
	// 			};

	// 			// Add the error response to the chat widget
	// 			this.viewModel.onAddResponse(errorResponseModel);

	// 			// Retrieve the error response view model from the chat view model
	// 			const errorResponseViewModel = this.viewModel.getItems().find(item => isResponseVM(item) && item.id === errorResponseModel.id) as IChatResponseViewModel | undefined;

	// 			if (errorResponseViewModel) {
	// 				// Handle accessibility and follow-up questions
	// 				this.chatAccessibilityService.acceptResponse(errorResponseViewModel, requestId);
	// 			}

	// 			// Notify the user about the error
	// 			// this.notificationService.error('Failed to process input with Gemini. Please try again.');
	// 			console.log('Failed to process input with Gemini. Please try again.');
	// 		}
	// 	}
	// 	return undefined;
	// }

	private _lastSelectedAgent: IChatAgentData | undefined;
	set lastSelectedAgent(agent: IChatAgentData | undefined) {
		this.parsedChatRequest = undefined;
		console.log('lastSelectedAgent', agent !== undefined);
		this._lastSelectedAgent = agent;
		this._onDidChangeParsedInput.fire();
	}

	get lastSelectedAgent(): IChatAgentData | undefined {
		return this._lastSelectedAgent;
	}

	private _completionContext: IChatWidgetCompletionContext = 'default';
	set completionContext(context: IChatWidgetCompletionContext) {
		this._completionContext = context;
	}

	get completionContext(): IChatWidgetCompletionContext {
		return this._completionContext;
	}

	get supportsFileReferences(): boolean {
		return !!this.viewOptions.supportsFileReferences;
	}

	get input(): ChatInputPart {
		return this.inputPart;
	}

	get inputEditor(): ICodeEditor {
		return this.inputPart.inputEditor;
	}

	get inputUri(): URI {
		return this.inputPart.inputUri;
	}

	get contentHeight(): number {
		return this.inputPart.contentHeight + this.tree.contentHeight;
	}

	render(parent: HTMLElement): void {
		const viewId = 'viewId' in this.viewContext ? this.viewContext.viewId : undefined;
		this.editorOptions = this._register(this.instantiationService.createInstance(ChatEditorOptions, viewId, this.styles.listForeground, this.styles.inputEditorBackground, this.styles.resultEditorBackground));
		const renderInputOnTop = this.viewOptions.renderInputOnTop ?? false;
		const renderFollowups = this.viewOptions.renderFollowups ?? !renderInputOnTop;
		const renderStyle = this.viewOptions.renderStyle;

		this.container = dom.append(parent, $('.interactive-session.aide-interactive-session'));
		if (renderInputOnTop) {
			this.createInput(this.container, { renderFollowups, renderStyle });
			this.listContainer = dom.append(this.container, $(`.interactive-list`));
		} else {
			this.listContainer = dom.append(this.container, $(`.interactive-list`));
			this.createInput(this.container, { renderFollowups, renderStyle });
		}

		this.createList(this.listContainer, { ...this.viewOptions.rendererOptions, renderStyle });

		this._register(this.editorOptions.onDidChange(() => this.onDidStyleChange()));
		this.onDidStyleChange();

		// Do initial render
		if (this.viewModel) {
			this.onDidChangeItems();
			revealLastElement(this.tree);
		}

		this.contribs = ChatWidget.CONTRIBS.map(contrib => {
			try {
				return this._register(this.instantiationService.createInstance(contrib, this));
			} catch (err) {
				this.logService.error('Failed to instantiate chat widget contrib', toErrorMessage(err));
				return undefined;
			}
		}).filter(isDefined);
	}

	getContrib<T extends IChatWidgetContrib>(id: string): T | undefined {
		return this.contribs.find(c => c.id === id) as T;
	}

	focusInput(): void {
		this.inputPart.focus();
	}

	hasInputFocus(): boolean {
		return this.inputPart.hasFocus();
	}

	getSibling(item: ChatTreeItem, type: 'next' | 'previous'): ChatTreeItem | undefined {
		if (!isResponseVM(item)) {
			return;
		}
		const items = this.viewModel?.getItems();
		if (!items) {
			return;
		}
		const responseItems = items.filter(i => isResponseVM(i));
		const targetIndex = responseItems.indexOf(item);
		if (targetIndex === undefined) {
			return;
		}
		const indexToFocus = type === 'next' ? targetIndex + 1 : targetIndex - 1;
		if (indexToFocus < 0 || indexToFocus > responseItems.length - 1) {
			return;
		}
		return responseItems[indexToFocus];
	}

	clear(): void {
		if (this._dynamicMessageLayoutData) {
			this._dynamicMessageLayoutData.enabled = true;
		}
		this._onDidClear.fire();
	}

	private onDidChangeItems(skipDynamicLayout?: boolean) {
		if (this.tree && this._visible) {
			const treeItems = (this.viewModel?.getItems() ?? [])
				.map((item): ITreeElement<ChatTreeItem> => {
					return {
						element: item,
						collapsed: false,
						collapsible: false
					};
				});

			this._onWillMaybeChangeHeight.fire();

			this.tree.setChildren(null, treeItems, {
				diffIdentityProvider: {
					getId: (element) => {
						return ((isResponseVM(element) || isRequestVM(element)) ? element.dataId : element.id) +
							// TODO? We can give the welcome message a proper VM or get rid of the rest of the VMs
							((isWelcomeVM(element) && this.viewModel) ? `_${ChatModelInitState[this.viewModel.initState]}` : '') +
							// Ensure re-rendering an element once slash commands are loaded, so the colorization can be applied.
							`${(isRequestVM(element) || isWelcomeVM(element)) /* && !!this.lastSlashCommands ? '_scLoaded' : '' */}` +
							// If a response is in the process of progressive rendering, we need to ensure that it will
							// be re-rendered so progressive rendering is restarted, even if the model wasn't updated.
							`${isResponseVM(element) && element.renderData ? `_${this.visibleChangeCount}` : ''}` +
							// Re-render once content references are loaded
							(isResponseVM(element) ? `_${element.contentReferences.length}` : '') +
							// Rerender request if we got new content references in the response
							// since this may change how we render the corresponding attachments in the request
							(isRequestVM(element) && element.contentReferences ? `_${element.contentReferences?.length}` : '');
					},
				}
			});

			if (!skipDynamicLayout && this._dynamicMessageLayoutData) {
				this.layoutDynamicChatTreeItemMode();
			}

			const lastItem = treeItems[treeItems.length - 1]?.element;
			if (lastItem && isResponseVM(lastItem) && lastItem.isComplete) {
				this.renderFollowups(lastItem.replyFollowups, lastItem);
			} else if (lastItem && isWelcomeVM(lastItem)) {
				this.renderFollowups(lastItem.sampleQuestions);
			} else {
				this.renderFollowups(undefined);
			}
		}
	}

	private async renderFollowups(items: IChatFollowup[] | undefined, response?: IChatResponseViewModel): Promise<void> {
		this.inputPart.renderFollowups(items, response);

		if (this.bodyDimension) {
			this.layout(this.bodyDimension.height, this.bodyDimension.width);
		}
	}

	setVisible(visible: boolean): void {
		const wasVisible = this._visible;
		this._visible = visible;
		this.visibleChangeCount++;
		this.renderer.setVisible(visible);
		this.input.setVisible(visible);

		if (visible) {
			this._register(disposableTimeout(() => {
				// Progressive rendering paused while hidden, so start it up again.
				// Do it after a timeout because the container is not visible yet (it should be but offsetHeight returns 0 here)
				if (this._visible) {
					this.onDidChangeItems(true);
				}
			}, 0));
		} else if (wasVisible) {
			this._onDidHide.fire();
		}
	}

	setWillBeDroppedStep(index: number | undefined): void {
		this.viewModel?.setWillBeDroppedStep(index);
	}

	setWillBeSavedStep(index: number | undefined): void {
		this.viewModel?.setWillBeSavedStep(index);
	}

	setSavedStep(index: number | undefined): void {
		this.viewModel?.setSavedStep(index);
	}

	private createList(listContainer: HTMLElement, options: IChatListItemRendererOptions): void {
		const scopedInstantiationService = this._register(this._register(this.instantiationService.createChild(new ServiceCollection([IContextKeyService, this.contextKeyService]))));
		const delegate = scopedInstantiationService.createInstance(ChatListDelegate, this.viewOptions.defaultElementHeight ?? 200);
		const rendererDelegate: IChatRendererDelegate = {
			kind: 'chat',
			getListLength: () => this.tree.getNode(null).visibleChildrenCount,
			setWillBeDroppedStep: this.setWillBeDroppedStep,
			setWillBeSavedStep: this.setWillBeSavedStep,
			setSavedStep: this.setSavedStep,
			onDidScroll: this.onDidScroll,
		};

		// Create a dom element to hold UI from editor widgets embedded in chat messages
		const overflowWidgetsContainer = document.createElement('div');
		overflowWidgetsContainer.classList.add('chat-overflow-widget-container', 'monaco-editor');
		listContainer.append(overflowWidgetsContainer);

		const user = TreeUser.Chat;
		// Update our renderer to be chat only over here in the widget
		this.renderer = this._register(scopedInstantiationService.createInstance(
			ChatListItemRenderer,
			'ChatWidget',
			this.editorOptions,
			this.location,
			options,
			rendererDelegate,
			this._codeBlockModelCollection,
			overflowWidgetsContainer,
		));
		this.renderer.rendererUser = user;
		this._register(this.renderer.onDidClickFollowup(item => {
			// is this used anymore?
			// this.acceptInput(item.message);
		}));
		this._register(this.renderer.onDidClickRerunWithAgentOrCommandDetection(item => {
			/* TODO(@ghostwriternr): Commenting this out definitely breaks rerunning requests. Fix this.
			const request = this.chatService.getSession(item.sessionId)?.getExchanges().find(candidate => candidate.id === item.requestId);
			if (request) {
				this.chatService.resendRequest(request, { noCommandDetection: true, attempt: request.attempt + 1, location: this.location }).catch(e => this.logService.error('FAILED to rerun request', e));
			}
			*/
		}));

		this.tree = this._register(<WorkbenchObjectTree<ChatTreeItem>>scopedInstantiationService.createInstance(
			WorkbenchObjectTree,
			user,
			listContainer,
			delegate,
			[this.renderer],
			{
				identityProvider: { getId: (e: ChatTreeItem) => e.id },
				horizontalScrolling: false,
				alwaysConsumeMouseWheel: false,
				supportDynamicHeights: true,
				hideTwistiesOfChildlessElements: true,
				accessibilityProvider: this.instantiationService.createInstance(ChatAccessibilityProvider),
				keyboardNavigationLabelProvider: { getKeyboardNavigationLabel: (e: ChatTreeItem) => isRequestVM(e) ? e.message : isResponseVM(e) ? e.response.value : '' }, // TODO
				setRowLineHeight: false,
				filter: this.viewOptions.filter ? { filter: this.viewOptions.filter.bind(this.viewOptions), } : undefined,
				overrideStyles: {
					listFocusBackground: this.styles.listBackground,
					listInactiveFocusBackground: this.styles.listBackground,
					listActiveSelectionBackground: this.styles.listBackground,
					listFocusAndSelectionBackground: this.styles.listBackground,
					listInactiveSelectionBackground: this.styles.listBackground,
					listHoverBackground: this.styles.listBackground,
					listBackground: this.styles.listBackground,
					listFocusForeground: this.styles.listForeground,
					listHoverForeground: this.styles.listForeground,
					listInactiveFocusForeground: this.styles.listForeground,
					listInactiveSelectionForeground: this.styles.listForeground,
					listActiveSelectionForeground: this.styles.listForeground,
					listFocusAndSelectionForeground: this.styles.listForeground,
					listActiveSelectionIconForeground: undefined,
					listInactiveSelectionIconForeground: undefined,
				}
			}));
		this._register(this.tree.onContextMenu(e => this.onContextMenu(e)));

		this._register(this.tree.onDidChangeContentHeight(() => {
			this.onDidChangeTreeContentHeight();
		}));
		this._register(this.tree.onDidChangeFocus((event) => {
			if (event.elements.length === 1) {
				const [firstElement] = event.elements;
				if (firstElement && isResponseVM(firstElement)) {
					const responseContent = firstElement.model.response.value;
					const hasPlanSteps = responseContent.some(el => el.kind === 'planStep');
					this.inChatResponseWithPlanSteps.set(hasPlanSteps);
				}
			}
		}));
		this._register(this.renderer.onDidChangeItemHeight(e => {
			this.tree.updateElementHeight(e.element, e.height);
		}));
		this._register(this.tree.onDidFocus(() => {
			this._onDidFocus.fire();
		}));
		this._register(this.tree.onDidScroll(() => {
			this._onDidScroll.fire();
		}));
	}

	private onContextMenu(e: ITreeContextMenuEvent<ChatTreeItem | null>): void {
		e.browserEvent.preventDefault();
		e.browserEvent.stopPropagation();

		const selected = e.element;
		const scopedContextKeyService = this.contextKeyService.createOverlay([
			[CONTEXT_RESPONSE_FILTERED.key, isResponseVM(selected) && !!selected.errorDetails?.responseIsFiltered]
		]);
		this.contextMenuService.showContextMenu({
			menuId: MenuId.AideAgentContext,
			menuActionOptions: { shouldForwardArgs: true },
			contextKeyService: scopedContextKeyService,
			getAnchor: () => e.anchor,
			getActionsContext: () => selected,
		});
	}

	private onDidChangeTreeContentHeight(): void {
		if (this.tree.scrollHeight !== this.previousTreeScrollHeight) {
			// Due to rounding, the scrollTop + renderHeight will not exactly match the scrollHeight.
			// Consider the tree to be scrolled all the way down if it is within 2px of the bottom.
			const lastElementWasVisible = this.tree.scrollTop + this.tree.renderHeight >= this.previousTreeScrollHeight - 2;
			if (lastElementWasVisible) {
				dom.scheduleAtNextAnimationFrame(dom.getWindow(this.listContainer), () => {
					// Can't set scrollTop during this event listener, the list might overwrite the change
					revealLastElement(this.tree);
				}, 0);
			}
		}

		this.previousTreeScrollHeight = this.tree.scrollHeight;
		this._onDidChangeContentHeight.fire();
	}

	private createInput(container: HTMLElement, options?: { renderFollowups: boolean; renderStyle?: 'default' | 'compact' | 'minimal' }): void {
		this.inputPart = this._register(this.instantiationService.createInstance(ChatInputPart,
			this.location,
			{
				renderFollowups: options?.renderFollowups ?? true,
				renderStyle: options?.renderStyle === 'minimal' ? 'compact' : options?.renderStyle,
				menus: { executeToolbar: MenuId.AideAgentExecute, ...this.viewOptions.menus },
				editorOverflowWidgetsDomNode: this.viewOptions.editorOverflowWidgetsDomNode,
			},
			() => this.collectInputState()
		));
		this.inputPart.render(container, '', this);

		this._register(this.inputPart.onDidLoadInputState(state => {
			this.contribs.forEach(c => {
				if (c.setInputState) {
					const contribState = (typeof state === 'object' && state?.[c.id]) ?? {};
					c.setInputState(contribState);
				}
			});
		}));
		this._register(this.inputPart.onDidFocus(() => this._onDidFocus.fire()));
		this._register(this.inputPart.onDidChangeContext((e) => this._onDidChangeContext.fire(e)));
		this._register(this.inputPart.onDidAcceptFollowup(e => {
			if (!this.viewModel) {
				return;
			}

			let msg = '';
			if (e.followup.agentId && e.followup.agentId !== this.chatAgentService.getDefaultAgent(this.location)?.id) {
				const agent = this.chatAgentService.getAgent(e.followup.agentId);
				if (!agent) {
					return;
				}

				this.lastSelectedAgent = agent;
				msg = `${chatAgentLeader}${agent.name} `;
				if (e.followup.subCommand) {
					msg += `${chatSubcommandLeader}${e.followup.subCommand} `;
				}
			} else if (!e.followup.agentId && e.followup.subCommand && this.chatSlashCommandService.hasCommand(e.followup.subCommand)) {
				msg = `${chatSubcommandLeader}${e.followup.subCommand} `;
			}

			msg += e.followup.message;
			// we do not work on top of followups, so we can disable this on our side
			// this.acceptInput(msg);

			if (!e.response) {
				// Followups can be shown by the welcome message, then there is no response associated.
				// At some point we probably want telemetry for these too.
				return;
			}

			this.chatService.notifyUserAction({
				sessionId: this.viewModel.sessionId,
				// requestId: e.response.requestId,
				// TODO(@ghostwriternr): This is obviously wrong, but not super critical. Come back to fix this.
				requestId: e.response.id,
				agentId: e.response.agent?.id,
				command: e.response.slashCommand?.name,
				result: e.response.result,
				action: {
					kind: 'followUp',
					followup: e.followup
				},
			});
		}));
		this._register(this.inputPart.onDidChangeHeight(() => {
			if (this.bodyDimension) {
				this.layout(this.bodyDimension.height, this.bodyDimension.width);
			}
			this._onDidChangeContentHeight.fire();
		}));
		this._register(this.inputEditor.onDidChangeModelContent(() => {
			this.parsedChatRequest = undefined;
			this.updateChatInputContext();
		}));
		this._register(this.chatAgentService.onDidChangeAgents(() => this.parsedChatRequest = undefined));
	}

	private onDidStyleChange(): void {
		this.container.style.setProperty('--vscode-interactive-result-editor-background-color', this.editorOptions.configuration.resultEditor.backgroundColor?.toString() ?? '');
		this.container.style.setProperty('--vscode-interactive-session-foreground', this.editorOptions.configuration.foreground?.toString() ?? '');
		this.container.style.setProperty('--vscode-chat-list-background', this.themeService.getColorTheme().getColor(this.styles.listBackground)?.toString() ?? '');
	}

	setModel(model: IChatModel, viewState: IChatViewState): void {
		if (!this.container) {
			throw new Error('Call render() before setModel()');
		}

		if (model.sessionId === this.viewModel?.sessionId) {
			return;
		}

		this._codeBlockModelCollection.clear();

		this.container.setAttribute('data-session-id', model.sessionId);

		this.viewModel = this.instantiationService.createInstance(ChatViewModel, model, this._codeBlockModelCollection);

		// Ensure viewModel is set before proceeding
		if (!this.viewModel) {
			console.log(`

			setModel(model: IChatModel, viewState: IChatViewState): void
			Ensure viewModel is set before proceeding

			`);
			return;
		}

		this.viewModelDisposables.add(Event.accumulate(this.viewModel.onDidChange, 0)(events => {
			if (!this.viewModel) {
				return;
			}

			// Reacting to the streamingState over here since these influence the
			// streamingStateWidget which is part of the ChatWidget
			events.filter((event) => (event?.kind === 'planInfo' || event?.kind === 'editsInfo')).forEach((event) => {
				if (event.kind === 'planInfo' && (event.state === ChatPlanState.Started || event.state === ChatPlanState.Complete)
					|| event.kind === 'editsInfo' && (event.state === ChatEditsState.Loading || event.state === ChatEditsState.MarkedComplete)
				) {
					this.updateStreamingState(event);
				} else {
					this.inputPart.hideStreamingState();
				}
			});

			// Reacting to the planRegenerationEvent over here since that influences
			// the current event we are intersted in
			events.filter((event) => event?.kind === 'planRegeneration').forEach((event) => {
				this.updatePlanRegenerationState(event);
			});

			this.requestInProgress.set(this.viewModel.requestInProgress);

			this.onDidChangeItems();
			if (events.some(e => e?.kind === 'addRequest') && this.visible) {
				revealLastElement(this.tree);
				this.focusInput();
			}
		}));
		this.viewModelDisposables.add(this.viewModel.onDidDisposeModel(() => {
			// Ensure that view state is saved here, because we will load it again when a new model is assigned
			this.inputPart.saveState();

			// Disposes the viewmodel and listeners
			this.viewModel = undefined;
			this.onDidChangeItems();
		}));
		this.inputPart.initForNewChatModel(viewState.inputValue, viewState.inputState ?? this.collectInputState());
		this.contribs.forEach(c => {
			if (c.setInputState && viewState.inputState?.[c.id]) {
				c.setInputState(viewState.inputState?.[c.id]);
			}
		});
		this.viewModelDisposables.add(model.onDidChange((e) => {
			if (e.kind === 'setAgent') {
				this._onDidChangeAgent.fire({ agent: e.agent, slashCommand: e.command });
			}
		}));

		if (this.tree) {
			this.onDidChangeItems();
			revealLastElement(this.tree);
		}
		this.updateChatInputContext();
	}

	getFocus(): ChatTreeItem | undefined {
		return this.tree.getFocus()[0] ?? undefined;
	}

	reveal(item: ChatTreeItem, relativeTop?: number): void {
		this.tree.reveal(item, relativeTop);
	}

	focus(item: ChatTreeItem): void {
		const items = this.tree.getNode(null).children;
		const node = items.find(i => i.element?.id === item.id);
		if (!node) {
			return;
		}

		this.tree.setFocus([node.element]);
		this.tree.domFocus();
	}

	refilter() {
		this.tree.refilter();
	}

	setInputPlaceholder(placeholder: string): void {
		this.viewModel?.setInputPlaceholder(placeholder);
	}

	resetInputPlaceholder(): void {
		this.viewModel?.resetInputPlaceholder();
	}

	setInput(value = ''): void {
		this.inputPart.setValue(value, false);
	}

	getInput(): string {
		return this.inputPart.inputEditor.getValue();
	}

	logInputHistory(): void {
		this.inputPart.logInputHistory();
	}

	async acceptIterationInput(query: string, sessionId: string, exchangeId: string): Promise<IChatResponseModel | undefined> {
		// this does not show up we have to gather it somewhere else I presume
		if (this.viewModel) {
			// scope here is dicated by how the command is run, not on the internal state
			// of the inputPart which was based on a selector before
			await this.chatService.sendIterationRequest(sessionId, exchangeId, query, {
				agentMode: AgentMode.Edit,
				agentScope: AgentScope.PinnedContext,
				userSelectedModelId: this.inputPart.currentLanguageModel,
				location: this.location,
				locationData: this._location.resolveData?.(),
				parserContext: { selectedAgent: this._lastSelectedAgent },
				attachedContext: [...this.inputPart.attachedContext.values()]
			});
			this.inputPart.acceptInput(true);
		}
		return undefined;
	}

	async acceptInput(mode: AgentMode, query: string): Promise<IChatResponseModel | undefined> {
		return this._acceptInput(query && mode ? { query, mode } : undefined);
	}

	// Leftover from the old chat view, not sure if this is still needed
	async acceptInputWithPrefix(prefix: string): Promise<void> {
		this._acceptInput({ prefix });
	}

	private updatePlanRegenerationState(event: IChatAideAgentPlanRegenerateInformationPart) {
		this._runningSessionId.set(event.sessionId);
		this._runningExchangeId.set(event.exchangeId);
	}

	private updateStreamingState(event: IChatEditsInfo | IChatPlanInfo) {
		const state = event.state;
		// If we are finished with the exchange, then set the streaming state to undefined
		//if (state === 'finished') {
		//CONTEXT_STREAMING_STATE.bindTo(this.contextKeyService).set(undefined);
		//this.inputPart.hideStreamingState();
		//} else
		// TODO should handle how to hide the streaming state
		if (state === 'cancelled') {
			// we have to make sure our editor reverts back to the basic
			this.aideAgentCodeEditingService.rejectEditsMadeDuringExchange(event.sessionId, event.exchangeId);
			// If the streaming state is showing cancelled, then we have to first
			// check if there are any edits associated with the session and the exchange
			// and do operations based on top of that
			// if (this.aideAgentCodeEditingService.doesExchangeHaveEdits(event.sessionId, event.exchangeId)) {
			// 	CONTEXT_STREAMING_STATE.bindTo(this.contextKeyService).set('waitingFeedback');
			// 	this.inputPart.updateStreamingState({
			// 		exchangeId: event.exchangeId,
			// 		sessionId: event.sessionId,
			// 		files: [],
			// 		isError: event.isError,
			// 		kind: 'streamingState',
			// 		state: 'waitingFeedback',
			// 		loadingLabel: event.loadingLabel,
			// 		message: event.message,
			// 	});
			// } else {
			// 	CONTEXT_STREAMING_STATE.bindTo(this.contextKeyService).set(undefined);
			// 	this.inputPart.hideStreamingState();
			// }
			CONTEXT_STREAMING_STATE.bindTo(this.contextKeyService).set(undefined);
			this.inputPart.hideStreamingState();
		} else {
			CONTEXT_STREAMING_STATE.bindTo(this.contextKeyService).set(state);
			// waiting for the feedback always goes over here for some reason
			// so we do end up showing the approve and reject buttons even
			// when there are no edits selected
			// we should have a way to figure that part out
			this.inputPart.updateStreamingState(event);
		}
	}

	private collectInputState(): IChatInputState {
		const inputState: IChatInputState = {};
		this.contribs.forEach(c => {
			if (c.getInputState) {
				inputState[c.id] = c.getInputState();
			}
		});
		return inputState;
	}

	transferQueryState(mode: AgentMode, scope: AgentScope): void {
		//this.inputPart.currentAgentMode = mode;
		this.inputPart.currentAgentScope = scope;
	}

	get planningEnabled(): boolean {
		return this.inputPart.planningEnabled;
	}

	togglePlanning(): void {
		this.inputPart.planningEnabled = !this.inputPart.planningEnabled;
	}

	setContext(overwrite: boolean, ...contentReferences: IChatRequestVariableEntry[]) {
		this.inputPart.attachContext(overwrite, ...contentReferences);
	}

	getCodeBlockInfosForResponse(response: IChatResponseViewModel): IChatCodeBlockInfo[] {
		return this.renderer.getCodeBlockInfosForResponse(response);
	}

	getCodeBlockInfoForEditor(uri: URI): IChatCodeBlockInfo | undefined {
		return this.renderer.getCodeBlockInfoForEditor(uri);
	}

	getFileTreeInfosForResponse(response: IChatResponseViewModel): IChatFileTreeInfo[] {
		return this.renderer.getFileTreeInfosForResponse(response);
	}

	getLastFocusedFileTreeForResponse(response: IChatResponseViewModel): IChatFileTreeInfo | undefined {
		return this.renderer.getLastFocusedFileTreeForResponse(response);
	}

	getPlanStepsInfoForResponse(response: IChatResponseViewModel): IChatPlanStepsInfo[] {
		return this.renderer.getPlanStepsInfoForResponse(response);
	}

	getLastFocusedPlanStepForResponse(response: IChatResponseViewModel): IChatPlanStepsInfo | undefined {
		return this.renderer.getLastFocusePlanStepForResponse(response);
	}

	focusLastMessage(): void {
		if (!this.viewModel) {
			return;
		}

		const items = this.tree.getNode(null).children;
		const lastItem = items[items.length - 1];
		if (!lastItem) {
			return;
		}

		this.tree.setFocus([lastItem.element]);
		this.tree.domFocus();
	}

	layout(height: number, width: number): void {
		width = Math.min(width, 850);
		this.bodyDimension = new dom.Dimension(width, height);

		this.inputPart.layout(height, width);
		const inputPartHeight = this.inputPart.inputPartHeight;
		const lastElementVisible = this.tree.scrollTop + this.tree.renderHeight >= this.tree.scrollHeight;

		const listHeight = height - inputPartHeight - 70; // Temporary hack to make sure the last element is not hidden by streaming widget

		this.tree.layout(listHeight, width);
		this.tree.getHTMLElement().style.height = `${listHeight}px`;
		this.renderer.layout(width);
		if (lastElementVisible) {
			revealLastElement(this.tree);
		}

		this.listContainer.style.height = `${height - inputPartHeight}px`;

		this._onDidChangeHeight.fire(height);
	}

	private _dynamicMessageLayoutData?: { numOfMessages: number; maxHeight: number; enabled: boolean };

	// An alternative to layout, this allows you to specify the number of ChatTreeItems
	// you want to show, and the max height of the container. It will then layout the
	// tree to show that many items.
	// TODO@TylerLeonhardt: This could use some refactoring to make it clear which layout strategy is being used
	setDynamicChatTreeItemLayout(numOfChatTreeItems: number, maxHeight: number) {
		this._dynamicMessageLayoutData = { numOfMessages: numOfChatTreeItems, maxHeight, enabled: true };
		this._register(this.renderer.onDidChangeItemHeight(() => this.layoutDynamicChatTreeItemMode()));

		const mutableDisposable = this._register(new MutableDisposable());
		this._register(this.tree.onDidScroll((e) => {
			// TODO@TylerLeonhardt this should probably just be disposed when this is disabled
			// and then set up again when it is enabled again
			if (!this._dynamicMessageLayoutData?.enabled) {
				return;
			}
			mutableDisposable.value = dom.scheduleAtNextAnimationFrame(dom.getWindow(this.listContainer), () => {
				if (!e.scrollTopChanged || e.heightChanged || e.scrollHeightChanged) {
					return;
				}
				const renderHeight = e.height;
				const diff = e.scrollHeight - renderHeight - e.scrollTop;
				if (diff === 0) {
					return;
				}

				const possibleMaxHeight = (this._dynamicMessageLayoutData?.maxHeight ?? maxHeight);
				const width = this.bodyDimension?.width ?? this.container.offsetWidth;
				this.inputPart.layout(possibleMaxHeight, width);
				const inputPartHeight = this.inputPart.inputPartHeight;
				const newHeight = Math.min(renderHeight + diff, possibleMaxHeight - inputPartHeight);
				this.layout(newHeight + inputPartHeight, width);
			});
		}));
	}

	updateDynamicChatTreeItemLayout(numOfChatTreeItems: number, maxHeight: number) {
		this._dynamicMessageLayoutData = { numOfMessages: numOfChatTreeItems, maxHeight, enabled: true };
		let hasChanged = false;
		let height = this.bodyDimension!.height;
		let width = this.bodyDimension!.width;
		if (maxHeight < this.bodyDimension!.height) {
			height = maxHeight;
			hasChanged = true;
		}
		const containerWidth = this.container.offsetWidth;
		if (this.bodyDimension?.width !== containerWidth) {
			width = containerWidth;
			hasChanged = true;
		}
		if (hasChanged) {
			this.layout(height, width);
		}
	}

	get isDynamicChatTreeItemLayoutEnabled(): boolean {
		return this._dynamicMessageLayoutData?.enabled ?? false;
	}

	set isDynamicChatTreeItemLayoutEnabled(value: boolean) {
		if (!this._dynamicMessageLayoutData) {
			return;
		}
		this._dynamicMessageLayoutData.enabled = value;
	}

	layoutDynamicChatTreeItemMode(): void {
		if (!this.viewModel || !this._dynamicMessageLayoutData?.enabled) {
			return;
		}

		const width = this.bodyDimension?.width ?? this.container.offsetWidth;
		this.inputPart.layout(this._dynamicMessageLayoutData.maxHeight, width);
		const inputHeight = this.inputPart.inputPartHeight;

		const totalMessages = this.viewModel.getItems();
		// grab the last N messages
		const messages = totalMessages.slice(-this._dynamicMessageLayoutData.numOfMessages);

		const needsRerender = messages.some(m => m.currentRenderedHeight === undefined);
		const listHeight = needsRerender
			? this._dynamicMessageLayoutData.maxHeight
			: messages.reduce((acc, message) => acc + message.currentRenderedHeight!, 0);

		this.layout(
			Math.min(
				// we add an additional 18px in order to show that there is scrollable content
				inputHeight + listHeight + (totalMessages.length > 2 ? 18 : 0),
				this._dynamicMessageLayoutData.maxHeight
			),
			width
		);

		if (needsRerender || !listHeight) {
			// TODO: figure out a better place to reveal the last element
			revealLastElement(this.tree);
		}
	}

	saveState(): void {
		this.inputPart.saveState();
	}

	getViewState(): IChatViewState {
		return { inputValue: this.getInput(), inputState: this.collectInputState() };
	}

	private updateChatInputContext() {
		if (!this.viewModel) {
			// console.log(`

			// updateChatInputContext
			// Skip if viewModel is not initialized

			// `);
			return; // Skip if viewModel is not initialized
		}
		const currentAgent = this.parsedInput.parts.find(part => part instanceof ChatRequestAgentPart);
		this.agentInInput.set(!!currentAgent);
		this.agentSupportsModelPicker.set(!currentAgent || !!currentAgent.agent.supportsModelPicker);
	}
}

export class ChatWidgetService implements IAideAgentWidgetService {

	declare readonly _serviceBrand: undefined;

	private _widgets: ChatWidget[] = [];
	private _lastFocusedWidget: ChatWidget | undefined = undefined;

	get lastFocusedWidget(): ChatWidget | undefined {
		return this._lastFocusedWidget;
	}

	constructor() { }

	getWidgetByInputUri(uri: URI): ChatWidget | undefined {
		return this._widgets.find(w => isEqual(w.inputUri, uri));
	}

	getWidgetBySessionId(sessionId: string): ChatWidget | undefined {
		return this._widgets.find(w => w.viewModel?.sessionId === sessionId);
	}

	private setLastFocusedWidget(widget: ChatWidget | undefined): void {
		if (widget === this._lastFocusedWidget) {
			return;
		}

		this._lastFocusedWidget = widget;
	}

	register(newWidget: ChatWidget): IDisposable {
		if (this._widgets.some(widget => widget === newWidget)) {
			throw new Error('Cannot register the same widget multiple times');
		}

		this._widgets.push(newWidget);

		return combinedDisposable(
			newWidget.onDidFocus(() => this.setLastFocusedWidget(newWidget)),
			toDisposable(() => this._widgets.splice(this._widgets.indexOf(newWidget), 1))
		);
	}
}
