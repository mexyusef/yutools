/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type * as vscode from 'vscode';
import { coalesce } from '../../../base/common/arrays.js';
import { raceCancellation } from '../../../base/common/async.js';
import { CancellationToken, CancellationTokenSource } from '../../../base/common/cancellation.js';
import { toErrorMessage } from '../../../base/common/errorMessage.js';
import { Emitter } from '../../../base/common/event.js';
import { IMarkdownString } from '../../../base/common/htmlContent.js';
import { Iterable } from '../../../base/common/iterator.js';
import { Disposable, DisposableMap, DisposableStore, toDisposable } from '../../../base/common/lifecycle.js';
import { revive } from '../../../base/common/marshalling.js';
import { assertType } from '../../../base/common/types.js';
import { URI } from '../../../base/common/uri.js';
import { ExtensionIdentifier, IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { ChatAgentLocation, IChatAgentRequest, IChatAgentResult } from '../../contrib/yuagent/common/aideAgentAgents.js';
import { ChatAgentVoteDirection, IChatFollowup, IChatResponseErrorDetails, IChatUserActionEvent, IChatVoteAction } from '../../contrib/yuagent/common/aideAgentService.js';
import { checkProposedApiEnabled, isProposedApiEnabled } from '../../services/extensions/common/extensions.js';
import { Dto } from '../../services/extensions/common/proxyIdentifier.js';
import { ExtHostAideAgentAgentsShape, IAideAgentProgressDto, IChatAgentCompletionItem, IChatAgentHistoryEntryDto, IMainContext, MainContext, MainThreadAideAgentAgentsShape2 } from './extHost.protocol.js';
import { CommandsConverter, ExtHostCommands } from './extHostCommands.js';
import { ExtHostDocuments } from './extHostDocuments.js';
import * as typeConvert from './extHostTypeConverters.js';
import * as extHostTypes from './extHostTypes.js';
import { IChatRequestVariableData } from '../../contrib/chat/common/chatModel.js';

class AideAgentResponseStream {
	private _isClosed: boolean = false;
	private _apiObject: vscode.AideAgentResponseStream | undefined;

	constructor(
		private readonly _responseId: string,
		private readonly _proxy: MainThreadAideAgentAgentsShape2,
		private readonly _commandsConverter: CommandsConverter,
		private readonly _sessionDisposables: DisposableStore
	) { }

	close() {
		this._isClosed = true;
	}

	get apiObject() {

		if (!this._apiObject) {
			const that = this;

			function throwIfDone(source: Function | undefined) {
				if (that._isClosed) {
					const err = new Error('Response stream has been closed');
					Error.captureStackTrace(err, source);
					throw err;
				}
			}

			const _report = (progress: IAideAgentProgressDto, task?: (progress: vscode.Progress<vscode.ChatResponseWarningPart | vscode.ChatResponseReferencePart>) => Thenable<string | void>) => {
				if (task) {
					const progressReporterPromise = this._proxy.$handleProgressChunk(this._responseId, progress);
					const progressReporter = {
						report: (p: vscode.ChatResponseWarningPart | vscode.ChatResponseReferencePart) => {
							progressReporterPromise?.then((handle) => {
								if (handle) {
									if (extHostTypes.MarkdownString.isMarkdownString(p.value)) {
										this._proxy.$handleProgressChunk(this._responseId, typeConvert.ChatResponseWarningPart.from(<vscode.ChatResponseWarningPart>p), handle);
									} else {
										this._proxy.$handleProgressChunk(this._responseId, typeConvert.ChatResponseReferencePart.from(<vscode.ChatResponseReferencePart>p), handle);
									}
								}
							});
						}
					};

					Promise.all([progressReporterPromise, task?.(progressReporter)]).then(([handle, res]) => {
						if (handle !== undefined) {
							this._proxy.$handleProgressChunk(this._responseId, typeConvert.ChatTaskResult.from(res), handle);
						}
					});
				} else {
					this._proxy.$handleProgressChunk(this._responseId, progress);
				}
			};

			this._apiObject = {
				markdown(value) {
					throwIfDone(this.markdown);
					const part = new extHostTypes.ChatResponseMarkdownPart(value);
					const dto = typeConvert.ChatResponseMarkdownPart.from(part);
					_report(dto);
					return this;
				},
				markdownWithVulnerabilities(value, vulnerabilities) {
					throwIfDone(this.markdown);

					const part = new extHostTypes.ChatResponseMarkdownWithVulnerabilitiesPart(value, vulnerabilities);
					const dto = typeConvert.ChatResponseMarkdownWithVulnerabilitiesPart.from(part);
					_report(dto);
					return this;
				},
				codeblockUri(value) {
					throwIfDone(this.codeblockUri);
					const part = new extHostTypes.ChatResponseCodeblockUriPart(value);
					const dto = typeConvert.ChatResponseCodeblockUriPart.from(part);
					_report(dto);
					return this;
				},
				filetree(value, baseUri) {
					throwIfDone(this.filetree);
					const part = new extHostTypes.ChatResponseFileTreePart(value, baseUri);
					const dto = typeConvert.ChatResponseFilesPart.from(part);
					_report(dto);
					return this;
				},
				anchor(value, title?: string) {
					throwIfDone(this.anchor);
					const part = new extHostTypes.ChatResponseAnchorPart(value, title);
					const dto = typeConvert.ChatResponseAnchorPart.from(part);
					_report(dto);
					return this;
				},
				button(value) {
					throwIfDone(this.anchor);
					const part = new extHostTypes.AideAgentResponseCommandButtonPart(value);
					const dto = typeConvert.AideAgentResponseCommandButtonPart.from(part, that._commandsConverter, that._sessionDisposables);
					_report(dto);
					return this;
				},
				buttonGroup(value) {
					throwIfDone(this.anchor);
					const part = new extHostTypes.AideAgentResponseCommandGroupPart(value);
					const dto = typeConvert.AideAgentResponseCommandGroupPart.from(part, that._commandsConverter, that._sessionDisposables);
					_report(dto);
					return this;
				},
				streamingState(value) {
					throwIfDone(this.anchor);
					const part = new extHostTypes.AideAgentResponseStreamingStatePart(value);
					const dto = typeConvert.AideAgentResponseStreamingStatePart.from(part);
					_report(dto);
				},
				regeneratePlan(planInformation) {
					throwIfDone(this.anchor);
					const part = new extHostTypes.AideAgentPlanRegenerateInformationPart(planInformation);
					const dto = typeConvert.AideAgentPlanRegenerateInformationPart.from(part);
					_report(dto);
				},
				thinkingForEdit(value) {
					throwIfDone(this.anchor);
					const part = new extHostTypes.AideAgentThinkingForEditPart(value);
					const dto = typeConvert.AideAgentThinkingForEditPart.from(part);
					_report(dto);
				},
				progress(value, task?: ((progress: vscode.Progress<vscode.ChatResponseWarningPart>) => Thenable<string | void>)) {
					throwIfDone(this.progress);
					const part = new extHostTypes.ChatResponseProgressPart2(value, task);
					const dto = task ? typeConvert.ChatTask.from(part) : typeConvert.ChatResponseProgressPart.from(part);
					_report(dto, task);
					return this;
				},
				editsInfo(value) {
					throwIfDone(this.anchor);
					const part = new extHostTypes.AideAgentResponseEditsInfoPart(value);
					const dto = typeConvert.AideAgentResponseEditsInfoPart.from(part);
					_report(dto);
					return this;
				},
				planInfo(value) {
					throwIfDone(this.anchor);
					const part = new extHostTypes.AideAgentResponsePlanInfoPart(value);
					const dto = typeConvert.AideAgentResponsePlanInfoPart.from(part);
					_report(dto);
					return this;
				},
				step(value) {
					throwIfDone(this.anchor);
					const part = new extHostTypes.AideAgentResponsePlanPart(value);
					const dto = typeConvert.AideAgentResponsePlanPart.from(part);
					_report(dto);
					return this;
				},
				warning(value) {
					throwIfDone(this.progress);
					const part = new extHostTypes.ChatResponseWarningPart(value);
					const dto = typeConvert.ChatResponseWarningPart.from(part);
					_report(dto);
					return this;
				},
				reference(value, iconPath) {
					return this.reference2(value, iconPath);
				},
				reference2(value, iconPath, options) {
					throwIfDone(this.reference);

					/* TODO(@ghostwriternr): Temporarily remove this until we have a way to pass the request object to the agent
					if (typeof value === 'object' && 'variableName' in value && !value.value) {
						// The participant used this variable. Does that variable have any references to pull in?
						const matchingVarData = that._request.variables.variables.find(v => v.name === value.variableName);
						if (matchingVarData) {
							let references: Dto<IChatContentReference>[] | undefined;
							if (matchingVarData.references?.length) {
								references = matchingVarData.references.map(r => ({
									kind: 'reference',
									reference: { variableName: value.variableName, value: r.reference as URI | Location }
								} satisfies IChatContentReference));
							} else {
								// Participant sent a variableName reference but the variable produced no references. Show variable reference with no value
								const part = new extHostTypes.ChatResponseReferencePart(value, iconPath, options);
								const dto = typeConvert.ChatResponseReferencePart.from(part);
								references = [dto];
							}

							references.forEach(r => _report(r));
							return this;
						} else {
							// Something went wrong- that variable doesn't actually exist
						}
					} else {*/
					const part = new extHostTypes.ChatResponseReferencePart(value, iconPath, options);
					const dto = typeConvert.ChatResponseReferencePart.from(part);
					_report(dto);
					//}

					return this;
				},
				codeCitation(value: vscode.Uri, license: string, snippet: string): void {
					throwIfDone(this.codeCitation);

					const part = new extHostTypes.ChatResponseCodeCitationPart(value, license, snippet);
					const dto = typeConvert.ChatResponseCodeCitationPart.from(part);
					_report(dto);
				},
				textEdit(target, edits) {
					throwIfDone(this.textEdit);

					const part = new extHostTypes.ChatResponseTextEditPart(target, edits);
					const dto = typeConvert.ChatResponseTextEditPart.from(part);
					_report(dto);
					return this;
				},
				codeEdit(edits) {
					throwIfDone(this.codeEdit);
					const part = new extHostTypes.ChatResponseCodeEditPart(edits);
					const dto = typeConvert.ChatResponseCodeEditPart.from(part);
					_report(dto);
					return this;
				},
				detectedParticipant(participant, command) {
					throwIfDone(this.detectedParticipant);

					const part = new extHostTypes.ChatResponseDetectedParticipantPart(participant, command);
					const dto = typeConvert.ChatResponseDetectedParticipantPart.from(part);
					_report(dto);
					return this;
				},
				confirmation(title, message, data, buttons) {
					throwIfDone(this.confirmation);

					const part = new extHostTypes.ChatResponseConfirmationPart(title, message, data, buttons);
					const dto = typeConvert.ChatResponseConfirmationPart.from(part);
					_report(dto);
					return this;
				},
				push(part) {
					throwIfDone(this.push);

					if (
						part instanceof extHostTypes.ChatResponseTextEditPart ||
						part instanceof extHostTypes.ChatResponseCodeEditPart ||
						part instanceof extHostTypes.ChatResponseMarkdownWithVulnerabilitiesPart ||
						part instanceof extHostTypes.ChatResponseDetectedParticipantPart ||
						part instanceof extHostTypes.ChatResponseWarningPart ||
						part instanceof extHostTypes.ChatResponseConfirmationPart ||
						part instanceof extHostTypes.ChatResponseCodeCitationPart ||
						part instanceof extHostTypes.ChatResponseMovePart
					) { }

					if (part instanceof extHostTypes.ChatResponseReferencePart) {
						// Ensure variable reference values get fixed up
						this.reference2(part.value, part.iconPath, part.options);
					} else {
						const dto = typeConvert.AideAgentResponsePart.from(part, that._commandsConverter, that._sessionDisposables);
						_report(dto);
					}

					return this;
				},
				close() {
					const dto = typeConvert.ChatResponseClosePart.from();
					_report(dto);
					that.close();
				}
			};
		}

		return this._apiObject;
	}
}

export class ExtHostAideAgentAgents2 extends Disposable implements ExtHostAideAgentAgentsShape {
	private static _idPool = 0;

	private readonly _agents = new Map<number, ExtHostChatAgent>();
	private readonly _proxy: MainThreadAideAgentAgentsShape2;

	private static _participantDetectionProviderIdPool = 0;
	private readonly _participantDetectionProviders = new Map<number, vscode.ChatParticipantDetectionProvider>();

	private readonly _sessionDisposables: DisposableMap<string, DisposableStore> = this._register(new DisposableMap());
	private readonly _completionDisposables: DisposableMap<number, DisposableStore> = this._register(new DisposableMap());

	constructor(
		mainContext: IMainContext,
		private readonly _logService: ILogService,
		private readonly _commands: ExtHostCommands,
		private readonly _documents: ExtHostDocuments
	) {
		super();
		this._proxy = mainContext.getProxy(MainContext.MainThreadAideAgentAgents2);
	}

	transferActiveChat(newWorkspace: vscode.Uri): void {
		this._proxy.$transferActiveChatSession(newWorkspace);
	}

	/**
	 * The id over here is for the chat participant
	 */
	createChatAgent(extension: IExtensionDescription, id: string, handler: vscode.AideSessionParticipant): vscode.AideSessionAgent {
		const handle = ExtHostAideAgentAgents2._idPool++;
		this._proxy.$registerAgent(handle, extension.identifier, id, {}, undefined);
		const agent = new ExtHostChatAgent(
			extension, id, this._proxy, handle,
			// Preserve the correct 'this' context
			(sessionId: string) => this.initResponse(sessionId),
			handler.newSession, handler.handleEvent, handler.handleExchangeUserAction, handler.handleSessionUndo, handler.handleSessionIterationRequest
		);
		this._agents.set(handle, agent);

		return agent.apiAgent;
	}

	registerChatParticipantDetectionProvider(provider: vscode.ChatParticipantDetectionProvider): vscode.Disposable {
		const handle = ExtHostAideAgentAgents2._participantDetectionProviderIdPool++;
		this._participantDetectionProviders.set(handle, provider);
		this._proxy.$registerChatParticipantDetectionProvider(handle);
		return toDisposable(() => {
			this._participantDetectionProviders.delete(handle);
			this._proxy.$unregisterChatParticipantDetectionProvider(handle);
		});
	}

	async $detectChatParticipant(handle: number, requestDto: Dto<IChatAgentRequest>, context: { history: IChatAgentHistoryEntryDto[] }, options: { location: ChatAgentLocation; participants?: vscode.ChatParticipantMetadata[] }, token: CancellationToken): Promise<vscode.ChatParticipantDetectionResult | null | undefined> {
		const { request, location, history } = await this._createRequest(requestDto, context);

		const provider = this._participantDetectionProviders.get(handle);
		if (!provider) {
			return undefined;
		}

		return provider.provideParticipantDetection(
			typeConvert.ChatAgentRequest.to(request, location),
			{ history },
			{ participants: options.participants, location: typeConvert.ChatLocation.to(options.location) },
			token
		);
	}

	private async _createRequest(requestDto: Dto<IChatAgentRequest>, context: { history: IChatAgentHistoryEntryDto[] }) {
		const request = revive<IChatAgentRequest>(requestDto);
		const convertedHistory = await this.prepareHistoryTurns(request.agentId, context);

		// in-place converting for location-data
		let location: vscode.ChatRequestEditorData | vscode.ChatRequestNotebookData | undefined;
		if (request.locationData?.type === ChatAgentLocation.Editor) {
			// editor data
			const document = this._documents.getDocument(request.locationData.document);
			location = new extHostTypes.ChatRequestEditorData(document, typeConvert.Selection.to(request.locationData.selection), typeConvert.Range.to(request.locationData.wholeRange));

		} else if (request.locationData?.type === ChatAgentLocation.Notebook) {
			// notebook data
			const cell = this._documents.getDocument(request.locationData.sessionInputUri);
			location = new extHostTypes.ChatRequestNotebookData(cell);

		} else if (request.locationData?.type === ChatAgentLocation.Terminal) {
			// TBD
		}

		return { request, location, history: convertedHistory };
	}

	$initSession(handle: number, sessionId: string): void {
		const agent = this._agents.get(handle);
		if (!agent) {
			throw new Error(`[CHAT](${handle}) CANNOT init session because the agent is not registered`);
		}

		// Init session disposables
		let sessionDisposables = this._sessionDisposables.get(sessionId);
		if (!sessionDisposables) {
			sessionDisposables = new DisposableStore();
			this._sessionDisposables.set(sessionId, sessionDisposables);
		}

		return agent.initSession(sessionId);
	}

	$handleUserFeedbackSession(handle: number, sessionId: string, exchangeId: string, stepIndex: number | undefined, accepted: boolean): void {
		const agent = this._agents.get(handle);
		if (agent) {
			agent.handleUserFeedbackForSession(sessionId, exchangeId, stepIndex, accepted);
		}
	}

	$handleSessionUndo(handle: number, sessionId: string, exchangeId: string): void {
		const agent = this._agents.get(handle);
		if (agent) {
			agent.handleSessionUndo(sessionId, exchangeId);
		}
	}

	$handleUserIterationRequest(handle: number, sessionId: string, exchangeId: string, iterationQuery: string, references: IChatRequestVariableData): void {
		const agent = this._agents.get(handle);
		if (agent) {
			agent.handleUserIterationRequest(sessionId, exchangeId, iterationQuery, references.variables.filter(v => !v.isTool).map(typeConvert.AideAgentPromptReference.to));
		}
	}

	async $invokeAgent(handle: number, requestDto: Dto<IChatAgentRequest>, context: { history: IChatAgentHistoryEntryDto[] }, token: CancellationToken): Promise<IChatAgentResult | undefined> {
		const agent = this._agents.get(handle);
		if (!agent) {
			throw new Error(`[CHAT](${handle}) CANNOT invoke agent because the agent is not registered`);
		}

		try {
			const { request, location } = await this._createRequest(requestDto, context);
			if (!isProposedApiEnabled(agent.extension, 'chatParticipantAdditions')) {
				delete request.userSelectedModelId;
			}

			const task = agent.invoke(
				typeConvert.AideAgentRequest.to(request, location),
				token
			);

			return await raceCancellation(Promise.resolve(task).then((result) => {
				if (result?.metadata) {
					try {
						JSON.stringify(result.metadata);
					} catch (err) {
						const msg = `result.metadata MUST be JSON.stringify-able. Got error: ${err.message}`;
						this._logService.error(`[${agent.extension.identifier.value}] [@${agent.id}] ${msg}`, agent.extension);
						return { errorDetails: { message: msg }, nextQuestion: result.nextQuestion } satisfies IChatAgentResult;
					}
				}
				let errorDetails: IChatResponseErrorDetails | undefined;
				if (result?.errorDetails) {
					errorDetails = {
						...result.errorDetails,
						responseIsIncomplete: true
					};
				}

				return { errorDetails, metadata: result?.metadata, nextQuestion: result?.nextQuestion } satisfies IChatAgentResult;
			}), token);
		} catch (e) {
			this._logService.error(e, agent.extension);

			if (e instanceof extHostTypes.LanguageModelError && e.cause) {
				e = e.cause;
			}

			return { errorDetails: { message: toErrorMessage(e), responseIsIncomplete: true } };
		}
	}

	private async initResponse(sessionId: string): Promise<{ stream: vscode.AideAgentResponseStream; token: CancellationToken; exchangeId: string } | undefined> {
		const sessionDisposables = this._sessionDisposables.get(sessionId);
		if (!sessionDisposables) {
			return undefined;
		}

		// Create a new cancellation token over here, this will proxy whatever
		// is happening on the editor side and relay this back to the extension
		const cancellationTokenSource = new CancellationTokenSource();
		// forcefully create the cancellation token over here
		const cancellationToken = cancellationTokenSource.token;

		const { responseId } = await this._proxy.$initResponse(sessionId);
		const stream = new AideAgentResponseStream(responseId, this._proxy, this._commands.converter, sessionDisposables);
		// javascript ftw, since this is an async function it does not get cleared
		// by the GC and keeps spinning in the background, what this means for us
		// is that we have a way to send to the extension layer what the cancellation
		// token status is as it is present on the editor layer
		this._proxy.$cancelExchange(sessionId, responseId).then(() => {
			// cancel the pending source over here
			cancellationTokenSource.cancel();
		});
		return { stream: stream.apiObject, token: cancellationToken, exchangeId: responseId };
	}

	private async prepareHistoryTurns(agentId: string, context: { history: IChatAgentHistoryEntryDto[] }): Promise<(vscode.ChatRequestTurn | vscode.ChatResponseTurn)[]> {
		const res: (vscode.ChatRequestTurn | vscode.ChatResponseTurn)[] = [];

		for (const h of context.history) {
			const ehResult = typeConvert.ChatAgentResult.to(h.result);
			const result: vscode.ChatResult = agentId === h.request.agentId ?
				ehResult :
				{ ...ehResult, metadata: undefined };

			// REQUEST turn
			const varsWithoutTools = h.request.variables.variables
				.filter(v => !v.isTool)
				.map(typeConvert.ChatPromptReference.to);
			const toolReferences = h.request.variables.variables
				.filter(v => v.isTool)
				.map(typeConvert.ChatLanguageModelToolReference.to);
			const turn = new extHostTypes.ChatRequestTurn(h.request.message, h.request.command, varsWithoutTools, h.request.agentId);
			turn.toolReferences = toolReferences;
			res.push(turn);

			// RESPONSE turn
			const parts = coalesce(h.response.map(r => typeConvert.AideAgentResponsePart.toContent(r, this._commands.converter)));
			res.push(new extHostTypes.ChatResponseTurn(parts, result, h.request.agentId, h.request.command));
		}

		return res;
	}

	$releaseSession(sessionId: string): void {
		this._sessionDisposables.deleteAndDispose(sessionId);
	}

	async $provideFollowups(requestDto: Dto<IChatAgentRequest>, handle: number, result: IChatAgentResult, context: { history: IChatAgentHistoryEntryDto[] }, token: CancellationToken): Promise<IChatFollowup[]> {
		const agent = this._agents.get(handle);
		if (!agent) {
			return Promise.resolve([]);
		}

		const request = revive<IChatAgentRequest>(requestDto);
		const convertedHistory = await this.prepareHistoryTurns(agent.id, context);

		const ehResult = typeConvert.ChatAgentResult.to(result);
		return (await agent.provideFollowups(ehResult, { history: convertedHistory }, token))
			.filter(f => {
				// The followup must refer to a participant that exists from the same extension
				const isValid = !f.participant || Iterable.some(
					this._agents.values(),
					a => a.id === f.participant && ExtensionIdentifier.equals(a.extension.identifier, agent.extension.identifier));
				if (!isValid) {
					this._logService.warn(`[@${agent.id}] ChatFollowup refers to an unknown participant: ${f.participant}`);
				}
				return isValid;
			})
			.map(f => typeConvert.ChatFollowup.from(f, request));
	}

	$acceptFeedback(handle: number, result: IChatAgentResult, voteAction: IChatVoteAction): void {
		const agent = this._agents.get(handle);
		if (!agent) {
			return;
		}

		const ehResult = typeConvert.ChatAgentResult.to(result);
		let kind: extHostTypes.ChatResultFeedbackKind;
		switch (voteAction.direction) {
			case ChatAgentVoteDirection.Down:
				kind = extHostTypes.ChatResultFeedbackKind.Unhelpful;
				break;
			case ChatAgentVoteDirection.Up:
				kind = extHostTypes.ChatResultFeedbackKind.Helpful;
				break;
		}

		const feedback: vscode.ChatResultFeedback = {
			result: ehResult,
			kind,
			unhelpfulReason: isProposedApiEnabled(agent.extension, 'chatParticipantAdditions') ? voteAction.reason : undefined,
		};
		agent.acceptFeedback(Object.freeze(feedback));
	}

	$acceptAction(handle: number, result: IChatAgentResult, event: IChatUserActionEvent): void {
		const agent = this._agents.get(handle);
		if (!agent) {
			return;
		}
		if (event.action.kind === 'vote') {
			// handled by $acceptFeedback
			return;
		}

		const ehAction = typeConvert.ChatAgentUserActionEvent.to(result, event, this._commands.converter);
		if (ehAction) {
			agent.acceptAction(Object.freeze(ehAction));
		}
	}

	async $invokeCompletionProvider(handle: number, query: string, token: CancellationToken): Promise<IChatAgentCompletionItem[]> {
		const agent = this._agents.get(handle);
		if (!agent) {
			return [];
		}

		let disposables = this._completionDisposables.get(handle);
		if (disposables) {
			// Clear any disposables from the last invocation of this completion provider
			disposables.clear();
		} else {
			disposables = new DisposableStore();
			this._completionDisposables.set(handle, disposables);
		}

		const items = await agent.invokeCompletionProvider(query, token);

		return items.map((i) => typeConvert.ChatAgentCompletionItem.from(i, this._commands.converter, disposables));
	}

	async $provideWelcomeMessage(handle: number, location: ChatAgentLocation, token: CancellationToken): Promise<(string | IMarkdownString)[] | undefined> {
		const agent = this._agents.get(handle);
		if (!agent) {
			return;
		}

		return await agent.provideWelcomeMessage(typeConvert.ChatLocation.to(location), token);
	}

	async $provideChatTitle(handle: number, context: IChatAgentHistoryEntryDto[], token: CancellationToken): Promise<string | undefined> {
		const agent = this._agents.get(handle);
		if (!agent) {
			return;
		}

		const history = await this.prepareHistoryTurns(agent.id, { history: context });
		return await agent.provideTitle({ history }, token);
	}

	async $provideSampleQuestions(handle: number, location: ChatAgentLocation, token: CancellationToken): Promise<IChatFollowup[] | undefined> {
		const agent = this._agents.get(handle);
		if (!agent) {
			return;
		}

		return (await agent.provideSampleQuestions(typeConvert.ChatLocation.to(location), token))
			.map(f => typeConvert.ChatFollowup.from(f, undefined));
	}
}

class ExtHostChatAgent {

	private _followupProvider: vscode.ChatFollowupProvider | undefined;
	private _iconPath: vscode.Uri | { light: vscode.Uri; dark: vscode.Uri } | vscode.ThemeIcon | undefined;
	private _helpTextPrefix: string | vscode.MarkdownString | undefined;
	private _helpTextVariablesPrefix: string | vscode.MarkdownString | undefined;
	private _helpTextPostfix: string | vscode.MarkdownString | undefined;
	private _isSecondary: boolean | undefined;
	private _onDidReceiveFeedback = new Emitter<vscode.ChatResultFeedback>();
	private _onDidPerformAction = new Emitter<vscode.ChatUserActionEvent>();
	private _supportIssueReporting: boolean | undefined;
	private _agentVariableProvider?: { provider: vscode.ChatParticipantCompletionItemProvider; triggerCharacters: string[] };
	private _welcomeMessageProvider?: vscode.ChatWelcomeMessageProvider | undefined;
	private _titleProvider?: vscode.ChatTitleProvider | undefined;
	private _requester: vscode.ChatRequesterInformation | undefined;
	private _supportsSlowReferences: boolean | undefined;

	constructor(
		public readonly extension: IExtensionDescription,
		public readonly id: string,
		private readonly _proxy: MainThreadAideAgentAgentsShape2,
		private readonly _handle: number,
		private _initResponse: vscode.AideSessionEventSender,
		private _sessionHandler: vscode.AideSessionHandler,
		private _requestHandler: vscode.AideSessionEventHandler,
		private _sessionHandleUserActionHandler: vscode.AideSessionHandleUserAction,
		private _sessionHandleSessionUndo: vscode.AideSessionUndoAction,
		private _sessionUserIterationRequest: vscode.AideSessionIterationRequest,
	) { }

	initSession(sessionId: string): void {
		this._sessionHandler(sessionId);
	}

	acceptFeedback(feedback: vscode.ChatResultFeedback) {
		this._onDidReceiveFeedback.fire(feedback);
	}

	acceptAction(event: vscode.ChatUserActionEvent) {
		this._onDidPerformAction.fire(event);
	}

	async invokeCompletionProvider(query: string, token: CancellationToken): Promise<vscode.ChatCompletionItem[]> {
		if (!this._agentVariableProvider) {
			return [];
		}

		return await this._agentVariableProvider.provider.provideCompletionItems(query, token) ?? [];
	}

	async provideFollowups(result: vscode.ChatResult, context: vscode.ChatContext, token: CancellationToken): Promise<vscode.ChatFollowup[]> {
		if (!this._followupProvider) {
			return [];
		}

		const followups = await this._followupProvider.provideFollowups(result, context, token);
		if (!followups) {
			return [];
		}
		return followups
			// Filter out "command followups" from older providers
			.filter(f => !(f && 'commandId' in f))
			// Filter out followups from older providers before 'message' changed to 'prompt'
			.filter(f => !(f && 'message' in f));
	}

	handleUserFeedbackForSession(sessionId: string, exchangeId: string, stepIndex: number | undefined, accepted: boolean): void {
		let action = extHostTypes.AideSessionExchangeUserAction.AcceptAll;
		if (!accepted) {
			action = extHostTypes.AideSessionExchangeUserAction.RejectAll;
		}
		this._sessionHandleUserActionHandler(sessionId, exchangeId, stepIndex, action);
	}

	handleUserIterationRequest(sessionId: string, exchangeId: string, iterationQuery: string, references: vscode.AideAgentPromptReference[]) {
		this._sessionUserIterationRequest(sessionId, exchangeId, iterationQuery, references);
	}

	handleSessionUndo(sessionId: string, exchangeId: string): void {
		this._sessionHandleSessionUndo(sessionId, exchangeId);
	}

	async provideWelcomeMessage(location: vscode.ChatLocation, token: CancellationToken): Promise<(string | IMarkdownString)[] | undefined> {
		if (!this._welcomeMessageProvider) {
			return [];
		}
		const content = await this._welcomeMessageProvider.provideWelcomeMessage(location, token);
		if (!content) {
			return [];
		}
		return content.map(item => {
			if (typeof item === 'string') {
				return item;
			} else {
				return typeConvert.MarkdownString.from(item);
			}
		});
	}

	async provideTitle(context: vscode.ChatContext, token: CancellationToken): Promise<string | undefined> {
		if (!this._titleProvider) {
			return;
		}

		return await this._titleProvider.provideChatTitle(context, token) ?? undefined;
	}

	async provideSampleQuestions(location: vscode.ChatLocation, token: CancellationToken): Promise<vscode.ChatFollowup[]> {
		if (!this._welcomeMessageProvider || !this._welcomeMessageProvider.provideSampleQuestions) {
			return [];
		}
		const content = await this._welcomeMessageProvider.provideSampleQuestions(location, token);
		if (!content) {
			return [];
		}

		return content;
	}

	get apiAgent(): vscode.AideSessionAgent {
		let disposed = false;
		let updateScheduled = false;
		const updateMetadataSoon = () => {
			if (disposed) {
				return;
			}
			if (updateScheduled) {
				return;
			}
			updateScheduled = true;
			queueMicrotask(() => {
				this._proxy.$updateAgent(this._handle, {
					icon: !this._iconPath ? undefined :
						this._iconPath instanceof URI ? this._iconPath :
							'light' in this._iconPath ? this._iconPath.light :
								undefined,
					iconDark: !this._iconPath ? undefined :
						'dark' in this._iconPath ? this._iconPath.dark :
							undefined,
					themeIcon: this._iconPath instanceof extHostTypes.ThemeIcon ? this._iconPath : undefined,
					hasFollowups: this._followupProvider !== undefined,
					isSecondary: this._isSecondary,
					helpTextPrefix: (!this._helpTextPrefix || typeof this._helpTextPrefix === 'string') ? this._helpTextPrefix : typeConvert.MarkdownString.from(this._helpTextPrefix),
					helpTextVariablesPrefix: (!this._helpTextVariablesPrefix || typeof this._helpTextVariablesPrefix === 'string') ? this._helpTextVariablesPrefix : typeConvert.MarkdownString.from(this._helpTextVariablesPrefix),
					helpTextPostfix: (!this._helpTextPostfix || typeof this._helpTextPostfix === 'string') ? this._helpTextPostfix : typeConvert.MarkdownString.from(this._helpTextPostfix),
					supportIssueReporting: this._supportIssueReporting,
					requester: this._requester,
					supportsSlowVariables: this._supportsSlowReferences,
				});
				updateScheduled = false;
			});
		};

		const that = this;
		return {
			get id() {
				return that.id;
			},
			get iconPath() {
				return that._iconPath;
			},
			set iconPath(v) {
				that._iconPath = v;
				updateMetadataSoon();
			},
			get requestHandler() {
				return that._requestHandler;
			},
			set requestHandler(v) {
				assertType(typeof v === 'function', 'Invalid request handler');
				that._requestHandler = v;
			},
			get initResponse() {
				return that._initResponse;
			},
			get followupProvider() {
				return that._followupProvider;
			},
			set followupProvider(v) {
				that._followupProvider = v;
				updateMetadataSoon();
			},
			get helpTextPrefix() {
				checkProposedApiEnabled(that.extension, 'defaultChatParticipant');
				return that._helpTextPrefix;
			},
			set helpTextPrefix(v) {
				checkProposedApiEnabled(that.extension, 'defaultChatParticipant');
				that._helpTextPrefix = v;
				updateMetadataSoon();
			},
			get helpTextVariablesPrefix() {
				checkProposedApiEnabled(that.extension, 'defaultChatParticipant');
				return that._helpTextVariablesPrefix;
			},
			set helpTextVariablesPrefix(v) {
				checkProposedApiEnabled(that.extension, 'defaultChatParticipant');
				that._helpTextVariablesPrefix = v;
				updateMetadataSoon();
			},
			get helpTextPostfix() {
				checkProposedApiEnabled(that.extension, 'defaultChatParticipant');
				return that._helpTextPostfix;
			},
			set helpTextPostfix(v) {
				checkProposedApiEnabled(that.extension, 'defaultChatParticipant');
				that._helpTextPostfix = v;
				updateMetadataSoon();
			},
			get isSecondary() {
				checkProposedApiEnabled(that.extension, 'defaultChatParticipant');
				return that._isSecondary;
			},
			set isSecondary(v) {
				checkProposedApiEnabled(that.extension, 'defaultChatParticipant');
				that._isSecondary = v;
				updateMetadataSoon();
			},
			get supportIssueReporting() {
				checkProposedApiEnabled(that.extension, 'chatParticipantPrivate');
				return that._supportIssueReporting;
			},
			set supportIssueReporting(v) {
				checkProposedApiEnabled(that.extension, 'chatParticipantPrivate');
				that._supportIssueReporting = v;
				updateMetadataSoon();
			},
			get onDidReceiveFeedback() {
				return that._onDidReceiveFeedback.event;
			},
			set participantVariableProvider(v) {
				checkProposedApiEnabled(that.extension, 'chatParticipantAdditions');
				that._agentVariableProvider = v;
				if (v) {
					if (!v.triggerCharacters.length) {
						throw new Error('triggerCharacters are required');
					}

					that._proxy.$registerAgentCompletionsProvider(that._handle, that.id, v.triggerCharacters);
				} else {
					that._proxy.$unregisterAgentCompletionsProvider(that._handle, that.id);
				}
			},
			get participantVariableProvider() {
				checkProposedApiEnabled(that.extension, 'chatParticipantAdditions');
				return that._agentVariableProvider;
			},
			set welcomeMessageProvider(v) {
				checkProposedApiEnabled(that.extension, 'defaultChatParticipant');
				that._welcomeMessageProvider = v;
				updateMetadataSoon();
			},
			get welcomeMessageProvider() {
				checkProposedApiEnabled(that.extension, 'defaultChatParticipant');
				return that._welcomeMessageProvider;
			},
			set titleProvider(v) {
				checkProposedApiEnabled(that.extension, 'defaultChatParticipant');
				that._titleProvider = v;
				updateMetadataSoon();
			},
			get titleProvider() {
				checkProposedApiEnabled(that.extension, 'defaultChatParticipant');
				return that._titleProvider;
			},
			onDidPerformAction: !isProposedApiEnabled(this.extension, 'chatParticipantAdditions')
				? undefined!
				: this._onDidPerformAction.event
			,
			set requester(v) {
				that._requester = v;
				updateMetadataSoon();
			},
			get requester() {
				return that._requester;
			},
			set supportsSlowReferences(v) {
				checkProposedApiEnabled(that.extension, 'chatParticipantPrivate');
				that._supportsSlowReferences = v;
				updateMetadataSoon();
			},
			get supportsSlowReferences() {
				checkProposedApiEnabled(that.extension, 'chatParticipantPrivate');
				return that._supportsSlowReferences;
			},
			dispose() {
				disposed = true;
				that._followupProvider = undefined;
				that._onDidReceiveFeedback.dispose();
				that._proxy.$unregisterAgent(that._handle);
			},
		} satisfies vscode.AideSessionAgent;
	}

	invoke(request: vscode.AideAgentRequest, token: CancellationToken): vscode.ProviderResult<vscode.ChatResult | void> {
		return this._requestHandler(request, token);
	}
}
