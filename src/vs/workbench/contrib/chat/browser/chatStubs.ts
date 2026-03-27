/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../../base/common/event.js';
import { IDisposable, Disposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { IChatAgentService, IChatAgent, IChatAgentData, IChatAgentResult, IChatAgentHistoryEntry, IChatAgentMetadata, IChatAgentRequest, IChatAgentNameService } from '../common/participants/chatAgents.js';
import { ILanguageModelToolsService, IToolData, IToolImpl, IToolAndToolSetEnablementMap, IToolInvocation, CountTokensCallback, IToolResult, IBeginToolCallOptions, IToolInvokedEvent, ToolSet, IToolSet } from '../common/tools/languageModelToolsService.js';
import { IChatWidgetService, IChatWidget, IChatViewViewContext, IChatResourceViewContext } from './chat.js';
import { IChatContextPickService } from './attachments/chatContextPickService.js';
import { ILanguageModelToolsConfirmationService } from '../common/tools/languageModelToolsConfirmationService.js';
import { IChatService, IChatProgress, ChatSendResult, IChatCompleteResponse, IChatDetail, IChatUserActionEvent, IChatSessionContext, IChatModelReference } from '../common/chatService/chatService.js';
import { IChatModel, IChatRequestModel, IExportableChatData, ISerializableChatData } from '../common/model/chatModel.js';
import { ILanguageModelsService, ILanguageModelChatMetadata, ILanguageModelProviderDescriptor, ILanguageModelsGroup, ILanguageModelChatSelector, ILanguageModelChatProvider, ILanguageModelChatMetadataAndIdentifier, IChatMessage, ILanguageModelChatRequestOptions, ILanguageModelChatResponse, IModelsControlManifest } from '../common/languageModels.js';
import { IChatSessionsService, IChatSession, IChatSessionItem, IChatNewSessionRequest, IChatSessionItemsDelta, ResolvedChatSessionsExtensionPoint, IChatSessionsExtensionPoint, IChatSessionItemController, IChatSessionContentProvider, IChatSessionRequestHistoryItem, IChatSessionOptionsWillNotifyExtensionEvent } from '../common/chatSessionsService.js';
import { IPromptsService, IPromptPath, PromptsStorage, IChatPromptSlashCommand, ICustomAgent, IResolvedAgentFile, IPromptDiscoveryLogEntry, IConfiguredHooksInfo } from '../common/promptSyntax/service/promptsService.js';
import { PromptsType } from '../common/promptSyntax/promptTypes.js';
import { IResolvedPromptSourceFolder } from '../common/promptSyntax/config/promptFileLocations.js';
import { ICodeMapperService, ICodeMapperProvider, ICodeMapperRequest, ICodeMapperResponse, ICodeMapperResult } from '../common/editing/chatCodeMapperService.js';
import { IChatEditingService, IChatEditingSession } from '../common/editing/chatEditingService.js';
import { IChatVariablesService, IDynamicVariable } from '../common/attachments/chatVariables.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { ITextModel } from '../../../../editor/common/model.js';
import { IObservable, observableValue, IReader } from '../../../../base/common/observable.js';
import { ResourceSet } from '../../../../base/common/map.js';
import { ChatAgentLocation } from '../common/constants.js';
import { IParsedChatRequest } from '../common/requestParser/chatParserTypes.js';

export class ChatAgentServiceStub implements IChatAgentService {
	_serviceBrand: undefined;
	readonly onDidChangeAgents: Event<IChatAgent | undefined> = Event.None;
	readonly onDidRegisterAgent: Event<IChatAgentData> = Event.None;
	readonly onDidUnregisterAgent: Event<IChatAgentData> = Event.None;
	readonly onDidChangeAgentHistory: Event<void> = Event.None;

	registerAgent(id: string, data: IChatAgentData): IDisposable { return Disposable.None; }
	registerAgentMetadata(id: string, metadata: IChatAgentMetadata): IDisposable { return Disposable.None; }
	registerDynamicAgent(data: IChatAgentData, agent: IChatAgent): IDisposable { return Disposable.None; }
	registerAgentHistory(agentId: string, history: IChatAgentHistoryEntry[]): void { }
	getAgents(): IChatAgentData[] { return []; }
	getAgent(id: string): IChatAgentData | undefined { return undefined; }
	getAgentByFullyQualifiedId(id: string): IChatAgentData | undefined { return undefined; }
	getActivatedAgents(): IChatAgent[] { return []; }
	getSecondaryAgent(): IChatAgentData | undefined { return undefined; }
	updateAgent(id: string, metadata: IChatAgentMetadata): void { }
	getDefaultAgent(location: ChatAgentLocation): IChatAgent | undefined { return undefined; }
	getContributedDefaultAgent(location: ChatAgentLocation): IChatAgentData | undefined { return undefined; }
	getAgentByLocation(location: ChatAgentLocation): IChatAgentData | undefined { return undefined; }
	getAgentsByName(name: string): IChatAgentData[] { return []; }
	hasAgent(id: string): boolean { return false; }
	getAgentHistory(id: string): IChatAgentHistoryEntry[] { return []; }
	clearAgentHistory(id: string): void { }
	invokeAgent(id: string, request: IChatAgentRequest, progress: (parts: IChatProgress[]) => void, history: IChatAgentHistoryEntry[], token: CancellationToken): Promise<IChatAgentResult> { return Promise.resolve({}); }
	setYieldRequested(agentId: string, requestId: string, yieldRequested: boolean): void { }
	getFollowups(agentId: string, request: IChatAgentRequest, result: IChatAgentResult, history: IChatAgentHistoryEntry[], token: CancellationToken): Promise<any[]> { return Promise.resolve([]); }
	getChatTitle(agentId: string, history: IChatAgentHistoryEntry[], token: CancellationToken): Promise<string | undefined> { return Promise.resolve(undefined); }
	getChatSummary(agentId: string, history: IChatAgentHistoryEntry[], token: CancellationToken): Promise<string | undefined> { return Promise.resolve(undefined); }
	agentHasDupeName(agentId: string): boolean { return false; }
	readonly hasToolsAgent: boolean = false;
	registerAgentImplementation(id: string, implementation: any): IDisposable { return Disposable.None; }
	registerAgentCompletionProvider(id: string, provider: any): IDisposable { return Disposable.None; }
	getAgentCompletionItems(id: string, location: ChatAgentLocation, token: CancellationToken): Promise<any[]> { return Promise.resolve([]); }
	registerChatParticipantDetectionProvider(handle: number, provider: any): IDisposable { return Disposable.None; }
	detectAgentOrCommand(request: IChatAgentRequest, history: IChatAgentHistoryEntry[], options: { location: ChatAgentLocation }, token: CancellationToken): Promise<any> { return Promise.resolve(undefined); }
	hasChatParticipantDetectionProviders(): boolean { return false; }
	setRequestTools(agent: string, requestId: string, tools: any): void { }
}

export class ChatAgentNameServiceStub implements IChatAgentNameService {
	_serviceBrand: undefined;
	getAgentNameRestriction(chatAgentData: IChatAgentData): boolean { return true; }
}

export class LanguageModelToolsServiceStub implements ILanguageModelToolsService {
	_serviceBrand: undefined;
	readonly vscodeToolSet: ToolSet = undefined as any;
	readonly executeToolSet: ToolSet = undefined as any;
	readonly readToolSet: ToolSet = undefined as any;
	readonly agentToolSet: ToolSet = undefined as any;
	readonly toolSets: IObservable<Iterable<IToolSet>> = observableValue(this, []);
	readonly onDidChangeTools: Event<void> = Event.None;
	readonly onDidPrepareToolCallBecomeUnresponsive: Event<{ readonly sessionResource: URI; readonly toolData: IToolData }> = Event.None;
	readonly onDidInvokeTool: Event<IToolInvokedEvent> = Event.None;

	registerToolData(data: IToolData): IDisposable { return Disposable.None; }
	registerToolImplementation(id: string, tool: IToolImpl): IDisposable { return Disposable.None; }
	registerTool(data: IToolData, tool: IToolImpl): IDisposable { return Disposable.None; }
	getTools(model: ILanguageModelChatMetadata | undefined): Iterable<IToolData> { return []; }
	observeTools(model: ILanguageModelChatMetadata | undefined): IObservable<readonly IToolData[]> { return observableValue(this, []); }
	getAllToolsIncludingDisabled(): Iterable<IToolData> { return []; }
	getTool(id: string): IToolData | undefined { return undefined; }
	getToolByName(name: string): IToolData | undefined { return undefined; }
	beginToolCall(options: IBeginToolCallOptions): any { return undefined; }
	updateToolStream(toolCallId: string, partialInput: unknown, token: CancellationToken): Promise<void> { return Promise.resolve(); }
	invokeTool(invocation: IToolInvocation, countTokens: CountTokensCallback, token: CancellationToken): Promise<IToolResult> { return Promise.resolve(undefined as any); }
	cancelToolCallsForRequest(requestId: string): void { }
	flushToolUpdates(): void { }
	getToolSetsForModel(model: ILanguageModelChatMetadata | undefined, reader?: IReader): Iterable<IToolSet> { return []; }
	getToolSet(id: string): IToolSet | undefined { return undefined; }
	getToolSetByName(name: string): IToolSet | undefined { return undefined; }
	createToolSet(source: any, id: string, referenceName: string, options?: any): any { return undefined; }
	getFullReferenceNames(): Iterable<string> { return []; }
	getFullReferenceName(tool: IToolData, toolSet?: IToolSet): string { return ''; }
	getToolByFullReferenceName(fullReferenceName: string): any { return undefined; }
	getDeprecatedFullReferenceNames(): Map<string, Set<string>> { return new Map(); }
	toToolAndToolSetEnablementMap(fullReferenceNames: readonly string[], model: ILanguageModelChatMetadata | undefined): IToolAndToolSetEnablementMap { return new Map(); }
	toFullReferenceNames(map: IToolAndToolSetEnablementMap): string[] { return []; }
	toToolReferences(variableReferences: readonly any[]): any[] { return []; }
}

export class ChatWidgetServiceStub implements IChatWidgetService {
	_serviceBrand: undefined;
	readonly onDidRegisterWidget: Event<IChatWidget> = Event.None;
	readonly onDidUnregisterWidget: Event<IChatWidget> = Event.None;
	readonly onDidAddWidget: Event<IChatWidget> = Event.None;
	readonly onDidBackgroundSession: Event<URI> = Event.None;
	readonly onDidChangeFocusedWidget: Event<IChatWidget | undefined> = Event.None;
	readonly onDidChangeFocusedSession: Event<void> = Event.None;

	lastFocusedWidget: IChatWidget | undefined = undefined;

	registerWidget(widget: IChatWidget): IDisposable { return Disposable.None; }
	getWidgetByInputUri(uri: URI): IChatWidget | undefined { return undefined; }
	getWidgetBySessionId(sessionId: string): IChatWidget | undefined { return undefined; }
	getWidgetBySessionResource(sessionResource: URI): IChatWidget | undefined { return undefined; }
	getWidgetsByLocations(location: any): ReadonlyArray<IChatWidget> { return []; }
	getAllWidgets(): ReadonlyArray<IChatWidget> { return []; }
	reveal(widget: IChatWidget, preserveFocus?: boolean): Promise<boolean> { return Promise.resolve(false); }
	revealWidget(preserveFocus?: boolean): Promise<IChatWidget | undefined> { return Promise.resolve(undefined); }
	openSession(sessionResource: URI, target?: any, options?: any): Promise<IChatWidget | undefined> { return Promise.resolve(undefined); }
	register(newWidget: IChatWidget): IDisposable { return Disposable.None; }
}

export class ChatContextPickServiceStub implements IChatContextPickService {
	_serviceBrand: undefined;
	readonly items: Iterable<any> = [];
	registerChatContextItem(item: any): IDisposable { return Disposable.None; }
	pickContext(widget: IChatWidget, context: IChatViewViewContext | IChatResourceViewContext): Promise<any> { return Promise.resolve(undefined); }
}

export class LanguageModelToolsConfirmationServiceStub implements ILanguageModelToolsConfirmationService {
	_serviceBrand: undefined;
	getPreConfirmAction(ref: any): any { return undefined; }
	getPostConfirmAction(ref: any): any { return undefined; }
	getPreConfirmActions(ref: any): any[] { return []; }
	getPostConfirmActions(ref: any): any[] { return []; }
	manageConfirmationPreferences(tools: readonly any[], options?: any): void { }
	registerConfirmationContribution(toolName: string, contribution: any): IDisposable { return Disposable.None; }
	toolCanManageConfirmation(tool: any): boolean { return false; }
	resetToolAutoConfirmation(): void { }
	confirmToolInvocation(toolId: string, parameters: any, token: CancellationToken): Promise<boolean> { return Promise.resolve(true); }
}

export class ChatServiceStub implements IChatService {
	_serviceBrand: undefined;
	transferredSessionResource: URI | undefined = undefined;
	readonly onDidSubmitRequest: Event<{ readonly chatSessionResource: URI; readonly message?: IParsedChatRequest }> = Event.None;
	readonly onDidCreateModel: Event<IChatModel> = Event.None;
	readonly chatModels: IObservable<Iterable<IChatModel>> = observableValue(this, []);
	readonly editingSessions: readonly IChatEditingSession[] = [];
	readonly onDidPerformUserAction: Event<IChatUserActionEvent> = Event.None;
	readonly onDidReceiveQuestionCarouselAnswer: Event<any> = Event.None;
	readonly onDidDisposeSession: Event<any> = Event.None;
	readonly requestInProgressObs: IObservable<boolean> = observableValue(this, false);

	isEnabled(location: ChatAgentLocation): boolean { return false; }
	hasSessions(): boolean { return false; }
	startNewLocalSession(location: ChatAgentLocation, options?: any): IChatModelReference { throw new Error('Not implemented'); }
	getSession(sessionResource: URI): IChatModel | undefined { return undefined; }
	acquireExistingSession(sessionResource: URI): IChatModelReference | undefined { return undefined; }
	acquireOrLoadSession(sessionResource: URI, location: ChatAgentLocation, token: CancellationToken): Promise<IChatModelReference | undefined> { throw new Error('Not implemented'); }
	loadSessionFromData(data: IExportableChatData | ISerializableChatData): IChatModelReference { throw new Error('Not implemented'); }
	getChatSessionFromInternalUri(sessionResource: URI): IChatSessionContext | undefined { return undefined; }
	sendRequest(sessionResource: URI, message: string, options?: any): Promise<ChatSendResult> { throw new Error('Not implemented'); }
	getSessionTitle(sessionResource: URI): string | undefined { return undefined; }
	setSessionTitle(sessionResource: URI, title: string): void { }
	appendProgress(request: IChatRequestModel, progress: IChatProgress): void { }
	resendRequest(request: IChatRequestModel, options?: any): Promise<void> { return Promise.resolve(); }
	adoptRequest(sessionResource: URI, request: IChatRequestModel): Promise<void> { return Promise.resolve(); }
	removeRequest(sessionResource: URI, requestId: string): Promise<void> { return Promise.resolve(); }
	cancelCurrentRequestForSession(sessionResource: URI, source?: string): Promise<void> { return Promise.resolve(); }
	migrateRequests(originalResource: URI, targetResource: URI): void { }
	setYieldRequested(sessionResource: URI): void { }
	removePendingRequest(sessionResource: URI, requestId: string): void { }
	setPendingRequests(sessionResource: URI, requests: readonly any[]): void { }
	processPendingRequests(sessionResource: URI): void { }
	addCompleteRequest(sessionResource: URI, message: any, variableData: any, attempt: number | undefined, response: IChatCompleteResponse): void { }
	setChatSessionTitle(sessionResource: URI, title: string): void { }
	getLocalSessionHistory(): Promise<IChatDetail[]> { return Promise.resolve([]); }
	clearAllHistoryEntries(): Promise<void> { return Promise.resolve(); }
	removeHistoryEntry(sessionResource: URI): Promise<void> { return Promise.resolve(); }
	getChatStorageFolder(): URI { throw new Error('Not implemented'); }
	logChatIndex(): void { }
	getLiveSessionItems(): Promise<IChatDetail[]> { return Promise.resolve([]); }
	getHistorySessionItems(): Promise<IChatDetail[]> { return Promise.resolve([]); }
	getMetadataForSession(sessionResource: URI): Promise<IChatDetail | undefined> { return Promise.resolve(undefined); }
	notifyUserAction(event: IChatUserActionEvent): void { }
	notifyQuestionCarouselAnswer(requestId: string, resolveId: string, answers: any): void { }
	transferChatSession(transferredSessionResource: URI, toWorkspace: URI): Promise<void> { return Promise.resolve(); }
	activateDefaultAgent(location: ChatAgentLocation): Promise<void> { return Promise.resolve(); }
	registerChatModelChangeListeners(chatSessionType: string, onChange: (chatSessionResource: URI) => void): IDisposable { return Disposable.None; }
	setSaveModelsEnabled(enabled: boolean): void { }
	waitForModelDisposals(): Promise<void> { return Promise.resolve(); }
}

export class LanguageModelsServiceStub implements ILanguageModelsService {
	_serviceBrand: undefined;
	readonly onDidChangeLanguageModelVendors: Event<readonly string[]> = Event.None;
	readonly onDidChangeLanguageModels: Event<string> = Event.None;
	readonly onDidChangeModelsControlManifest: Event<IModelsControlManifest> = Event.None;
	readonly restrictedChatParticipants: IObservable<{ [name: string]: string[] }> = observableValue(this, {});

	updateModelPickerPreference(modelIdentifier: string, showInModelPicker: boolean): void { }
	getLanguageModelIds(): string[] { return []; }
	getVendors(): ILanguageModelProviderDescriptor[] { return []; }
	lookupLanguageModel(modelId: string): ILanguageModelChatMetadata | undefined { return undefined; }
	lookupLanguageModelByQualifiedName(qualifiedName: string): ILanguageModelChatMetadataAndIdentifier | undefined { return undefined; }
	getLanguageModelGroups(vendor: string): ILanguageModelsGroup[] { return []; }
	selectLanguageModels(selector: ILanguageModelChatSelector): Promise<string[]> { return Promise.resolve([]); }
	registerLanguageModelProvider(vendor: string, provider: ILanguageModelChatProvider): IDisposable { return Disposable.None; }
	deltaLanguageModelChatProviderDescriptors(added: any[], removed: any[]): void { }
	sendChatRequest(modelId: string, from: any, messages: IChatMessage[], options: ILanguageModelChatRequestOptions, token: CancellationToken): Promise<ILanguageModelChatResponse> { throw new Error('Not implemented'); }
	computeTokenLength(modelId: string, message: string | IChatMessage, token: CancellationToken): Promise<number> { return Promise.resolve(0); }
	getModelConfiguration(modelId: string): any { return undefined; }
	setModelConfiguration(modelId: string, values: any): Promise<void> { return Promise.resolve(); }
	getModelConfigurationActions(modelId: string): any[] { return []; }
	addLanguageModelsProviderGroup(name: string, vendorId: string, configuration: any): Promise<void> { return Promise.resolve(); }
	removeLanguageModelsProviderGroup(vendorId: string, providerGroupName: string): Promise<void> { return Promise.resolve(); }
	configureLanguageModelsProviderGroup(vendorId: string, name?: string): Promise<void> { return Promise.resolve(); }
	configureModel(modelId: string): Promise<void> { return Promise.resolve(); }
	migrateLanguageModelsProviderGroup(languageModelsProviderGroup: any): Promise<void> { return Promise.resolve(); }
	getRecentlyUsedModelIds(): string[] { return []; }
	addToRecentlyUsedList(modelIdentifier: string): void { }
	clearRecentlyUsedList(): void { }
	getModelsControlManifest(): IModelsControlManifest { return { free: {}, paid: {} }; }
}

export class ChatSessionsServiceStub implements IChatSessionsService {
	_serviceBrand: undefined;
	readonly onDidChangeItemsProviders: Event<{ readonly chatSessionType: string }> = Event.None;
	readonly onDidChangeSessionItems: Event<IChatSessionItemsDelta> = Event.None;
	readonly onDidChangeAvailability: Event<void> = Event.None;
	readonly onDidChangeInProgress: Event<void> = Event.None;
	readonly onDidChangeContentProviderSchemes: Event<{ readonly added: string[]; readonly removed: string[] }> = Event.None;
	readonly onDidChangeSessionOptions: Event<URI> = Event.None;
	readonly onDidChangeOptionGroups: Event<string> = Event.None;
	readonly onRequestNotifyExtension: Event<IChatSessionOptionsWillNotifyExtensionEvent> = Event.None;

	getChatSessionContribution(chatSessionType: string): ResolvedChatSessionsExtensionPoint | undefined { return undefined; }
	getAllChatSessionContributions(): ResolvedChatSessionsExtensionPoint[] { return []; }
	registerChatSessionContribution(contribution: IChatSessionsExtensionPoint): IDisposable { return Disposable.None; }
	registerChatSessionItemController(chatSessionType: string, controller: IChatSessionItemController): IDisposable { return Disposable.None; }
	getRegisteredChatSessionItemProviders(): readonly string[] { return []; }
	activateChatSessionItemProvider(chatSessionType: string): Promise<void> { return Promise.resolve(); }
	getChatSessionItems(providerTypeFilter: readonly string[] | undefined, token: CancellationToken): AsyncIterable<any> { return (async function* () { })(); }
	refreshChatSessionItems(providerTypeFilter: readonly string[] | undefined, token: CancellationToken): Promise<void> { return Promise.resolve(); }
	reportInProgress(chatSessionType: string, count: number): void { }
	getInProgress(): { displayName: string; count: number }[] { return []; }
	getContentProviderSchemes(): string[] { return []; }
	registerChatSessionContentProvider(scheme: string, provider: IChatSessionContentProvider): IDisposable { return Disposable.None; }
	canResolveChatSession(sessionType: string): Promise<boolean> { return Promise.resolve(false); }
	getOrCreateChatSession(sessionResource: URI, token: CancellationToken): Promise<IChatSession> { throw new Error('Not implemented'); }
	hasAnySessionOptions(sessionResource: URI): boolean { return false; }
	getSessionOptions(sessionResource: URI): any { return undefined; }
	getSessionOption(sessionResource: URI, optionId: string): any { return undefined; }
	setSessionOption(sessionResource: URI, optionId: string, value: any): boolean { return false; }
	getCapabilitiesForSessionType(chatSessionType: string): any { return undefined; }
	getCustomAgentTargetForSessionType(chatSessionType: string): any { return undefined; }
	requiresCustomModelsForSessionType(chatSessionType: string): boolean { return false; }
	supportsDelegationForSessionType(chatSessionType: string): boolean { return true; }
	sessionSupportsFork(sessionResource: URI): boolean { return false; }
	forkChatSession(sessionResource: URI, request: IChatSessionRequestHistoryItem | undefined, token: CancellationToken): Promise<IChatSessionItem> { throw new Error('Not implemented'); }
	getOptionGroupsForSessionType(chatSessionType: string): any { return undefined; }
	setOptionGroupsForSessionType(chatSessionType: string, handle: number, optionGroups?: any): void { }
	getNewSessionOptionsForSessionType(chatSessionType: string): any { return undefined; }
	setNewSessionOptionsForSessionType(chatSessionType: string, options: any): void { }
	notifySessionOptionsChange(sessionResource: URI, updates: any): Promise<void> { return Promise.resolve(); }
	getInProgressSessionDescription(chatModel: any): string | undefined { return undefined; }
	createNewChatSessionItem(chatSessionType: string, request: IChatNewSessionRequest, token: CancellationToken): Promise<IChatSessionItem | undefined> { return Promise.resolve(undefined); }
	registerSessionResourceAlias(untitledResource: URI, realResource: URI): void { }
}

export class PromptsServiceStub implements IPromptsService {
	_serviceBrand: undefined;
	readonly onDidChangeSlashCommands: Event<void> = Event.None;
	readonly onDidChangeCustomAgents: Event<void> = Event.None;
	readonly onDidChangeInstructions: Event<void> = Event.None;
	readonly onDidChangeSkills: Event<void> = Event.None;
	readonly onDidLogDiscovery: Event<IPromptDiscoveryLogEntry> = Event.None;

	dispose(): void { }
	getParsedPromptFile(textModel: ITextModel): any { return undefined; }
	listPromptFiles(type: PromptsType, token: CancellationToken): Promise<readonly IPromptPath[]> { return Promise.resolve([]); }
	listPromptFilesForStorage(type: PromptsType, storage: PromptsStorage, token: CancellationToken): Promise<readonly IPromptPath[]> { return Promise.resolve([]); }
	getSourceFolders(type: PromptsType): Promise<readonly IPromptPath[]> { return Promise.resolve([]); }
	getResolvedSourceFolders(type: PromptsType): Promise<readonly IResolvedPromptSourceFolder[]> { return Promise.resolve([]); }
	isValidSlashCommandName(name: string): boolean { return false; }
	resolvePromptSlashCommand(command: string, token: CancellationToken): Promise<IChatPromptSlashCommand | undefined> { return Promise.resolve(undefined); }
	getPromptSlashCommands(token: CancellationToken, sessionResource?: URI): Promise<readonly IChatPromptSlashCommand[]> { return Promise.resolve([]); }
	getPromptSlashCommandName(uri: URI, token: CancellationToken): Promise<string> { return Promise.resolve(''); }
	getCustomAgents(token: CancellationToken, sessionResource?: URI): Promise<readonly ICustomAgent[]> { return Promise.resolve([]); }
	parseNew(uri: URI, token: CancellationToken): Promise<any> { return Promise.resolve(undefined); }
	registerContributedFile(type: PromptsType, uri: URI, extension: any, name: string | undefined, description: string | undefined, when?: string): IDisposable { return Disposable.None; }
	getPromptLocationLabel(promptPath: IPromptPath): string { return ''; }
	listNestedAgentMDs(token: CancellationToken): Promise<IResolvedAgentFile[]> { return Promise.resolve([]); }
	listAgentInstructions(token: CancellationToken, logger?: any): Promise<IResolvedAgentFile[]> { return Promise.resolve([]); }
	getAgentFileURIFromModeFile(oldURI: URI): URI | undefined { return undefined; }
	getDisabledPromptFiles(type: PromptsType): ResourceSet { return new ResourceSet(); }
	setDisabledPromptFiles(type: PromptsType, uris: ResourceSet): void { }
	registerPromptFileProvider(extension: any, type: PromptsType, provider: any): IDisposable { return Disposable.None; }
	findAgentSkills(token: CancellationToken, sessionResource?: URI): Promise<any[] | undefined> { return Promise.resolve(undefined); }
	getHooks(token: CancellationToken, sessionResource?: URI): Promise<IConfiguredHooksInfo | undefined> { return Promise.resolve(undefined); }
	getInstructionFiles(token: CancellationToken, sessionResource?: URI): Promise<readonly IPromptPath[]> { return Promise.resolve([]); }
}

export class CodeMapperServiceStub implements ICodeMapperService {
	_serviceBrand: undefined;
	readonly providers: ICodeMapperProvider[] = [];
	registerCodeMapperProvider(handle: number, provider: ICodeMapperProvider): IDisposable { return Disposable.None; }
	mapCode(request: ICodeMapperRequest, response: ICodeMapperResponse, token: CancellationToken): Promise<ICodeMapperResult | undefined> { return Promise.resolve(undefined); }
}

export class ChatEditingServiceStub implements IChatEditingService {
	_serviceBrand: undefined;
	readonly editingSessionsObs: IObservable<readonly IChatEditingSession[]> = observableValue(this, []);
	startOrContinueGlobalEditingSession(chatModel: any): IChatEditingSession { throw new Error('Not implemented'); }
	getEditingSession(chatSessionResource: URI): IChatEditingSession | undefined { return undefined; }
	createEditingSession(chatModel: any): IChatEditingSession { throw new Error('Not implemented'); }
	transferEditingSession(chatModel: any, session: IChatEditingSession): IChatEditingSession { throw new Error('Not implemented'); }
}

export class ChatVariablesServiceStub implements IChatVariablesService {
	_serviceBrand: undefined;
	getDynamicVariables(sessionResource: URI): ReadonlyArray<IDynamicVariable> { return []; }
	getSelectedToolAndToolSets(sessionResource: URI): IToolAndToolSetEnablementMap { return new Map(); }
}
