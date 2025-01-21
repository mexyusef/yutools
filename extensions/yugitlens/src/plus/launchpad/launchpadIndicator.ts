import * as vscode from 'vscode';
import type { ConfigurationChangeEvent, StatusBarItem } from 'vscode';
import { Disposable, MarkdownString, StatusBarAlignment, ThemeColor, window } from 'vscode';
import type { OpenWalkthroughCommandArgs } from '../../commands/walkthroughs';
import { proBadge } from '../../constants';
import type { Colors } from '../../constants.colors';
import { GlCommand } from '../../constants.commands';
import type { HostingIntegrationId } from '../../constants.integrations';
import type { Container } from '../../container';
import { groupByMap } from '../../system/iterable';
import { wait } from '../../system/promise';
import { pluralize } from '../../system/string';
import { executeCommand, registerCommand } from '../../system/vscode/command';
import { configuration } from '../../system/vscode/configuration';
import type { ConnectionStateChangeEvent } from '../integrations/integrationService';
import type { LaunchpadCommandArgs } from './launchpad';
import type { LaunchpadItem, LaunchpadProvider, LaunchpadRefreshEvent } from './launchpadProvider';
import { groupAndSortLaunchpadItems, supportedLaunchpadIntegrations } from './launchpadProvider';
import type { LaunchpadGroup } from './models';
import { launchpadGroupIconMap, launchpadPriorityGroups } from './models';

type LaunchpadIndicatorState = 'idle' | 'disconnected' | 'loading' | 'load' | 'failed';

export class LaunchpadIndicator implements Disposable {
	private readonly _disposable: Disposable;
	private _categorizedItems: LaunchpadItem[] | undefined;
	/** Tracks if this is the first state after startup */
	private _firstStateAfterStartup: boolean = true;
	private _hasRefreshed: boolean = false;
	private _lastDataUpdate: Date | undefined;
	private _lastRefreshPaused: Date | undefined;
	private _refreshTimer: ReturnType<typeof setInterval> | undefined;
	private _state?: LaunchpadIndicatorState;
	private _statusBarLaunchpad!: StatusBarItem;

	constructor(
		private readonly container: Container,
		private readonly provider: LaunchpadProvider,
	) {
		this._disposable = Disposable.from(
			window.onDidChangeWindowState(this.onWindowStateChanged, this),
			provider.onDidRefresh(this.onLaunchpadRefreshed, this),
			configuration.onDidChange(this.onConfigurationChanged, this),
			container.integrations.onDidChangeConnectionState(this.onConnectedIntegrationsChanged, this),
			...this.registerCommands(),
		);

		void this.onReady();
	}

	dispose() {
		this.clearRefreshTimer();
		this._statusBarLaunchpad?.dispose();
		this._disposable.dispose();
	}

	private get pollingEnabled() {
		return (
			configuration.get('launchpad.indicator.polling.enabled') &&
			configuration.get('launchpad.indicator.polling.interval') > 0
		);
	}

	private get pollingInterval() {
		return configuration.get('launchpad.indicator.polling.interval') * 1000 * 60;
	}

	private async onConnectedIntegrationsChanged(e: ConnectionStateChangeEvent) {
		if (supportedLaunchpadIntegrations.includes(e.key as HostingIntegrationId)) {
			await this.maybeLoadData(true);
		}
	}

	private async onConfigurationChanged(e: ConfigurationChangeEvent) {
		if (!configuration.changed(e, 'launchpad.indicator')) return;

		if (configuration.changed(e, 'launchpad.indicator.label')) {
			this.updateStatusBarCommand();
		}

		let load = false;

		if (configuration.changed(e, 'launchpad.indicator.polling')) {
			if (configuration.changed(e, 'launchpad.indicator.polling.enabled')) {
				load = true;
			} else if (configuration.changed(e, 'launchpad.indicator.polling.interval')) {
				this.startRefreshTimer();
			}
		}

		load ||=
			configuration.changed(e, 'launchpad.indicator.useColors') ||
			configuration.changed(e, 'launchpad.indicator.icon') ||
			configuration.changed(e, 'launchpad.indicator.label') ||
			configuration.changed(e, 'launchpad.indicator.groups');

		if (load) {
			await this.maybeLoadData();
		}
	}

	private async maybeLoadData(forceIfConnected: boolean = false) {
		if (this.pollingEnabled) {
			if (await this.provider.hasConnectedIntegration()) {
				if (this._state === 'load' && this._categorizedItems != null && !forceIfConnected) {
					this.updateStatusBarState('load', this._categorizedItems);
				} else {
					this.updateStatusBarState('loading');
				}
			} else {
				this.updateStatusBarState('disconnected');
			}
		} else {
			this.updateStatusBarState('idle');
		}
	}

	private onLaunchpadRefreshed(e: LaunchpadRefreshEvent) {
		this._hasRefreshed = true;
		if (!this.pollingEnabled) {
			this.updateStatusBarState('idle');

			return;
		}

		if (e.error != null) {
			this.updateStatusBarState('failed');

			return;
		}

		this.updateStatusBarState('load', e.items);
	}

	private async onReady(): Promise<void> {
		this._statusBarLaunchpad = window.createStatusBarItem('gitlens.launchpad', StatusBarAlignment.Left, 10000 - 3);
		this._statusBarLaunchpad.name = 'GitLens Launchpad';

		await this.maybeLoadData();
		this.updateStatusBarCommand();

		this._statusBarLaunchpad.show();
	}

	private onWindowStateChanged(e: { focused: boolean }) {
		if (this._state === 'disconnected' || this._state === 'idle') return;

		if (!e.focused) {
			this.clearRefreshTimer();
			this._lastRefreshPaused = new Date();

			return;
		}

		if (this._lastRefreshPaused == null) return;
		if (this._state === 'loading') {
			this.startRefreshTimer();

			return;
		}

		const now = Date.now();
		const timeSinceLastUpdate = this._lastDataUpdate != null ? now - this._lastDataUpdate.getTime() : undefined;
		const timeSinceLastUnfocused = now - this._lastRefreshPaused.getTime();
		this._lastRefreshPaused = undefined;

		const refreshInterval = configuration.get('launchpad.indicator.polling.interval') * 1000 * 60;

		let timeToNextPoll = timeSinceLastUpdate != null ? refreshInterval - timeSinceLastUpdate : refreshInterval;
		if (timeToNextPoll < 0) {
			timeToNextPoll = 0;
		}

		const diff = timeToNextPoll - timeSinceLastUnfocused;
		this.startRefreshTimer(diff < 0 ? 0 : diff);
	}

	private clearRefreshTimer() {
		if (this._refreshTimer != null) {
			clearInterval(this._refreshTimer);
			this._refreshTimer = undefined;
		}
	}

	private startRefreshTimer(startDelay?: number) {
		const starting = this._firstStateAfterStartup;
		if (starting) {
			this._firstStateAfterStartup = false;
		}

		this.clearRefreshTimer();
		if (!this.pollingEnabled || this._state === 'disconnected') {
			if (this._state !== 'idle' && this._state !== 'disconnected') {
				this.updateStatusBarState('idle');
			}
			return;
		}

		const startRefreshInterval = () => {
			this._refreshTimer = setInterval(() => {
				void this.provider.getCategorizedItems({ force: true });
			}, this.pollingInterval);
		};

		if (startDelay != null) {
			this._refreshTimer = setTimeout(() => {
				startRefreshInterval();

				// If we are loading at startup, wait to give vscode time to settle before querying
				if (starting) {
					// Using a wait here, instead using the `startDelay` to avoid case where the timer could be cancelled if the user focused a different windows before the timer fires (because we will cancel the timer)
					void wait(5000).then(() => {
						// If something else has already caused a refresh, don't do another one
						if (this._hasRefreshed) return;

						void this.provider.getCategorizedItems({ force: true });
					});
				} else {
					void this.provider.getCategorizedItems({ force: true });
				}
			}, startDelay);
		} else {
			startRefreshInterval();
		}
	}

	private updateStatusBarState(state: LaunchpadIndicatorState, categorizedItems?: LaunchpadItem[]) {
		if (state !== 'load' && state === this._state) return;

		this._state = state;
		this._categorizedItems = categorizedItems;

		const tooltip = new MarkdownString('', true);
		tooltip.supportHtml = true;
		tooltip.isTrusted = true;

		// \u00a0\u00a0&mdash;\u00a0\u00a0
		// \u00a0\u00a0\u00a0\u00a0&mdash;\u00a0\u00a0\u00a0\u00a0
		// tooltip.appendMarkdown(`GitLens Launchpad ${proBadge}\u00a0\u00a0\u00a0\u00a0&mdash;\u00a0\u00a0\u00a0\u00a0`);
		// tooltip.appendMarkdown(`[$(question)](command:gitlens.launchpad.indicator.action?%22info%22 "What is this?")`);
		// tooltip.appendMarkdown('\u00a0');
		// tooltip.appendMarkdown(`[$(gear)](command:workbench.action.openSettings?%22gitlens.launchpad%22 "Settings")`);
		// tooltip.appendMarkdown('\u00a0\u00a0|\u00a0\u00a0');
		// tooltip.appendMarkdown(`[$(circle-slash) Hide](command:gitlens.launchpad.indicator.action?%22hide%22 "Hide")`);
		// tooltip.appendMarkdown('\n\n---\n\n');
		tooltip.appendMarkdown(`[$(gear)](command:workbench.action.openSettings?%22yutools%22 "Settings")
		\u00a0\u00a0|\u00a0\u00a0
		[🗂️](command:yutools.editor_fold_all "Fold All")
		\u00a0\u00a0|\u00a0\u00a0
		[🎧](command:yutools.toggleZenMode "toggleZenMode")
		\u00a0\u00a0|\u00a0\u00a0
		[◀️](command:yutools.togglePrimarySidebar "togglePrimarySidebar")
		\u00a0\u00a0|\u00a0\u00a0
		[👁️](command:yutools.togglePanelVisibility "togglePanelVisibility")
		\u00a0\u00a0|\u00a0\u00a0
		[LLM](command:yutools.toggleShowLLMRawQuery "toggleShowLLMRawQuery")
		\u00a0\u00a0|\u00a0\u00a0
		[Code](command:yutools.toggleShowLLMCodeQuery "toggleShowLLMCodeQuery")
		\u00a0\u00a0|\u00a0\u00a0
		[FMUS](command:yutools.toggleShowLLMFmusQuery "toggleShowLLMFmusQuery")
		\u00a0\u00a0|\u00a0\u00a0
		[MM](command:yutools.toggleShowLLMMultimodalQuery "toggleShowLLMMultimodalQuery")
		\u00a0\u00a0|\u00a0\u00a0
		[Stream](command:yutools.toggleShowLLMStreamingQuery "toggleShowLLMStreamingQuery")
		\u00a0\u00a0|\u00a0\u00a0
		[👀LLM](command:yutools.llm.config.showSettingsPanel "LLM Models+Parameters")
		\u00a0\u00a0|\u00a0\u00a0
		[✏️LLM](command:yutools.llm.settings.changeSettings3 "Change LLM Settings")
		`);

		tooltip.appendMarkdown('\n\n---\n\n');

		tooltip.appendMarkdown(`[package.json](command:yutools.dynamic-commands.openDynamicFile?%7B%22filePath%22%3A%22C%3A%5C%5Cai%5C%5Cyuagent%5C%5Cextensions%5C%5Cyutools%5C%5Cpackage.json%22%7D "Buka yutools/package.json")
		\u00a0\u00a0|\u00a0\u00a0
		[launchpadIndicator.ts](command:yutools.dynamic-commands.openDynamicFile?%7B%22filePath%22%3A%22C%3A%5C%5Cai%5C%5Cyuagent%5C%5Cextensions%5C%5Cyugitlens%5C%5Csrc%5C%5Cplus%5C%5Claunchpad%5C%5ClaunchpadIndicator.ts%22%7D "Buka File di editor")
		\u00a0\u00a0|\u00a0\u00a0
		[sotaswe:extensions.ts](command:yutools.dynamic-commands.openDynamicFile?%7B%22filePath%22%3A%22C%3A%5C%5Cai%5C%5Cyuagent%5C%5Cextensions%5C%5Cyuswe%5C%5Csrc%5C%5Cextension.ts%22%7D "Buka File di editor")
		\u00a0\u00a0|\u00a0\u00a0
		[ai_url_files.md](command:yutools.dynamic-commands.openDynamicFile?%7B%22filePath%22%3A%22C%3A%5C%5CUsers%5C%5Cusef%5C%5Cai_url_files.md%22%7D "Baca file ini")
		\u00a0\u00a0|\u00a0\u00a0
		[terminal_commands.md](command:yutools.dynamic-commands.openDynamicFile?%7B%22filePath%22%3A%22C%3A%5C%5CUsers%5C%5Cusef%5C%5Cterminal_commands.md%22%7D "Baca file berisi perintah jalankan perintah di direktori tertentu")
		\u00a0\u00a0|\u00a0\u00a0
		[ai-chats.json](command:yutools.dynamic-commands.openDynamicFile?%7B%22filePath%22%3A%22C%3A%5C%5CUsers%5C%5Cusef%5C%5Cai-chats.json%22%7D "Buka File di editor")
		\u00a0\u00a0|\u00a0\u00a0
		[commands.json](command:yutools.dynamic-commands.openDynamicFile?%7B%22filePath%22%3A%22C%3A%5C%5CUsers%5C%5Cusef%5C%5Ccommands.json%22%7D "Buka commands.json")
		\u00a0\u00a0|\u00a0\u00a0
		[BANTUAN.md](command:yutools.dynamic-commands.openDynamicFile?%7B%22filePath%22%3A%22C%3A%5C%5Cai%5C%5Cfulled%5C%5Cextensions%5C%5Cfulled%5C%5Csrc%5C%5Cdocs%5C%5CBANTUAN.md%22%7D "Buka File di editor")
		\u00a0\u00a0|\u00a0\u00a0
		[TODO.md](command:yutools.dynamic-commands.openDynamicFile?%7B%22filePath%22%3A%22C%3A%5C%5Cai%5C%5Cyuagent%5C%5Cextensions%5C%5Cyutools%5C%5CTODO.md%22%7D "Buka File di editor")
		`);
		
		tooltip.appendMarkdown('\n\n---\n\n');

		tooltip.appendMarkdown(`[Pull](command:yutools.dynamic-commands.openTerminalWithArgs?%7B%22terminalName%22%3A%22checkout%20main%2Bpull%20in%20single%20command%22%2C%22cwd%22%3A%22c%3A%5C%5Cai%5C%5Cyuagent%5C%5Cextensions%5C%5Cyu-servers%5C%5Caider%22%2C%22commands%22%3A%5B%22git%20branch%20%26%26%20git%20checkout%20main%20%26%26%20git%20pull%22%5D%7D "Jalankan openTerminalWithArgs")
		\u00a0\u00a0|\u00a0\u00a0
		[Run](command:yutools.llm.tools.aider.runAider "Run")
		\u00a0\u00a0|\u00a0\u00a0
		[Run+BaseURL](command:yutools.llm.tools.aider.runAiderWithApiBase "Run+BaseURL")
		\u00a0\u00a0|\u00a0\u00a0
		[Cmd](command:yutools.llm.tools.aider.sendCommandToTerminal "Cmd")
		\u00a0\u00a0|\u00a0\u00a0
		@aider
		`);

		tooltip.appendMarkdown('\n\n---\n\n');

		tooltip.appendMarkdown(`[⚠️checkout main+pull](command:yutools.dynamic-commands.openTerminalWithArgs?%7B%22terminalName%22%3A%22checkout%20main%2Bpull%20%40bolt.diy%22%2C%22cwd%22%3A%22c%3A%5C%5Cai%5C%5Cyuagent%5C%5Cextensions%5C%5Cyu-servers%5C%5Cbolt.diy%22%2C%22commands%22%3A%5B%22git%20branch%22%2C%22git%20checkout%20main%22%2C%22git%20pull%22%5D%7D "checkout main+pull")
		\u00a0\u00a0|\u00a0\u00a0
		[✅checkout main+pull in single command](command:yutools.dynamic-commands.openTerminalWithArgs?%7B%22terminalName%22%3A%22checkout%20main%2Bpull%20in%20single%20command%22%2C%22cwd%22%3A%22c%3A%5C%5Cai%5C%5Cyuagent%5C%5Cextensions%5C%5Cyu-servers%5C%5Cbolt.diy%22%2C%22commands%22%3A%5B%22git%20branch%20%26%26%20git%20checkout%20main%20%26%26%20git%20pull%22%5D%7D "checkout main+pull in single command")
		\u00a0\u00a0|\u00a0\u00a0
		[usef+pnpm install+🔄build](command:yutools.dynamic-commands.openTerminalWithArgs?%7B%22terminalName%22%3A%22pnpm%20install%2Bbuild%20%40bolt.diy%22%2C%22cwd%22%3A%22c%3A%5C%5Cai%5C%5Cyuagent%5C%5Cextensions%5C%5Cyu-servers%5C%5Cbolt.diy%22%2C%22commands%22%3A%5B%22wsl%22%2C%22git%20branch%22%2C%22git%20checkout%20usef%22%2C%22pnpm%20install%22%2C%22pnpm%20run%20build%22%5D%7D "pnpm install+build")
		\u00a0\u00a0|\u00a0\u00a0
		[usef+▶️run dev](command:yutools.dynamic-commands.openTerminalWithArgs?%7B%22terminalName%22%3A%22pnpm%20run%20dev%20%40bolt.diy%22%2C%22cwd%22%3A%22c%3A%5C%5Cai%5C%5Cyuagent%5C%5Cextensions%5C%5Cyu-servers%5C%5Cbolt.diy%22%2C%22commands%22%3A%5B%22wsl%22%2C%22git%20branch%22%2C%22git%20checkout%20usef%22%2C%22pnpm%20run%20dev%22%5D%7D "checkout main+run dev")
		\u00a0\u00a0|\u00a0\u00a0
		[branch usef](command:yutools.dynamic-commands.openTerminalWithArgs?%7B%22terminalName%22%3A%22branch%20usef%20%40bolt.diy%22%2C%22cwd%22%3A%22c%3A%5C%5Cai%5C%5Cyuagent%5C%5Cextensions%5C%5Cyu-servers%5C%5Cbolt.diy%22%2C%22commands%22%3A%5B%22git%20branch%20%26%26%20git%20checkout%20usef%20%26%26%20git%20branch%22%5D%7D "git checkout usef")
		\u00a0\u00a0|\u00a0\u00a0
		[branch main](command:yutools.dynamic-commands.openTerminalWithArgs?%7B%22terminalName%22%3A%22branch%20usef%20%40bolt.diy%22%2C%22cwd%22%3A%22c%3A%5C%5Cai%5C%5Cyuagent%5C%5Cextensions%5C%5Cyu-servers%5C%5Cbolt.diy%22%2C%22commands%22%3A%5B%22git%20branch%20%26%26%20git%20checkout%20main%20%26%26%20git%20branch%22%5D%7D "git checkout usef")
		\u00a0\u00a0|\u00a0\u00a0
		[vsp](command:yutools.dynamic-commands.openTerminalWithArgs?%7B%22terminalName%22%3A%22vsp%20.%22%2C%22cwd%22%3A%22c%3A%5C%5Cai%5C%5Cyuagent%5C%5Cextensions%5C%5Cyu-servers%5C%5Cbolt.diy%22%2C%22commands%22%3A%5B%22vsp%20.%22%5D%7D "Jalankan vscode portable")
		\u00a0\u00a0|\u00a0\u00a0
		@bolt.diy
		`);

		tooltip.appendMarkdown('\n\n---\n\n');

		tooltip.appendMarkdown(`[pnpm run dev](command:yutools.dynamic-commands.openTerminalWithArgs?%7B%22terminalName%22%3A%22pnpm%20run%20dev%20%40bolt.any%22%2C%22cwd%22%3A%22c%3A%5C%5Cai%5C%5Cyuagent%5C%5Cextensions%5C%5Cyu-servers%5C%5Cbolt.new-any-llm%22%2C%22commands%22%3A%5B%22wsl%22%2C%22pnpm%20run%20dev%22%5D%7D "Jalankan openTerminalWithArgs")
		\u00a0\u00a0|\u00a0\u00a0
		[pnpm run build](command:yutools.dynamic-commands.openTerminalWithArgs?%7B%22terminalName%22%3A%22pnpm%20run%20build%20%40bolt.any%22%2C%22cwd%22%3A%22c%3A%5C%5Cai%5C%5Cyuagent%5C%5Cextensions%5C%5Cyu-servers%5C%5Cbolt.new-any-llm%22%2C%22commands%22%3A%5B%22wsl%22%2C%22pnpm%20run%20build%22%5D%7D "Jalankan openTerminalWithArgs")
		\u00a0\u00a0|\u00a0\u00a0
		[vsp](command:yutools.dynamic-commands.openTerminalWithArgs?%7B%22terminalName%22%3A%22vsp%20%40bolt.any%22%2C%22cwd%22%3A%22c%3A%5C%5Cai%5C%5Cyuagent%5C%5Cextensions%5C%5Cyu-servers%5C%5Cbolt.new-any-llm%22%2C%22commands%22%3A%5B%22vsp%20.%22%5D%7D "Jalankan openTerminalWithArgs")
		\u00a0\u00a0|\u00a0\u00a0
		@bolt.any-llm
		`);

		tooltip.appendMarkdown('\n\n---\n\n');

		tooltip.appendMarkdown(`[Pull cline](command:yutools.dynamic-commands.openTerminalWithArgs?%7B%22terminalName%22%3A%22Git%20pull%20cline%22%2C%22cwd%22%3A%22c%3A%5C%5Cai%5C%5Cyuagent%5C%5Cextensions%5C%5Cyu-servers%5C%5Ccline%22%2C%22commands%22%3A%5B%22pwd%22%2C%22git%20pull%22%5D%7D "Jalankan openTerminalWithArgs")
		\u00a0\u00a0|\u00a0\u00a0
		[Pull roo-cline](command:yutools.dynamic-commands.openTerminalWithArgs?%7B%22terminalName%22%3A%22Git%20pull%20Roo-Cline%22%2C%22cwd%22%3A%22c%3A%5C%5Cai%5C%5Cyuagent%5C%5Cextensions%5C%5Cyu-servers%5C%5CRoo-Cline%22%2C%22commands%22%3A%5B%22pwd%22%2C%22git%20pull%22%5D%7D "Jalankan openTerminalWithArgs")
		\u00a0\u00a0|\u00a0\u00a0
		[Pull srcbook](command:yutools.dynamic-commands.openTerminalWithArgs?%7B%22terminalName%22%3A%22Pull%20%40srcbook%22%2C%22cwd%22%3A%22c%3A%5C%5Cai%5C%5Cyuagent%5C%5Cextensions%5C%5Cyu-servers%5C%5Csrcbook%22%2C%22commands%22%3A%5B%22git%20pull%22%5D%7D "Jalankan openTerminalWithArgs")
		\u00a0\u00a0|\u00a0\u00a0
		[Pull smolagents](command:yutools.dynamic-commands.openTerminalWithArgs?%7B%22terminalName%22%3A%22checkout%20main%2Bpull%20in%20single%20command%22%2C%22cwd%22%3A%22c%3A%5C%5Cai%5C%5Cyuagent%5C%5Cextensions%5C%5Cyu-servers%5C%5Csmolagents%22%2C%22commands%22%3A%5B%22git%20branch%20%26%26%20git%20checkout%20main%20%26%26%20git%20pull%22%5D%7D "Jalankan openTerminalWithArgs")
		\u00a0\u00a0|\u00a0\u00a0
		[Pull llamacoder](command:yutools.dynamic-commands.openTerminalWithArgs?%7B%22terminalName%22%3A%22Git%20pull%20groq-appgen%22%2C%22cwd%22%3A%22c%3A%5C%5Cai%5C%5Cyuagent%5C%5Cextensions%5C%5Cyu-servers%5C%5Cgroq-appgen%22%2C%22commands%22%3A%5B%22pwd%22%2C%22git%20pull%22%5D%7D "Jalankan openTerminalWithArgs")
		\u00a0\u00a0|\u00a0\u00a0
		[Pull groq-appgen](command:yutools.dynamic-commands.openTerminalWithArgs?%7B%22terminalName%22%3A%22Git%20pull%20llamacoder%22%2C%22cwd%22%3A%22c%3A%5C%5Cai%5C%5Cyuagent%5C%5Cextensions%5C%5Cyu-servers%5C%5Cllamacoder%22%2C%22commands%22%3A%5B%22pwd%22%2C%22git%20pull%22%5D%7D "Jalankan openTerminalWithArgs")
		\u00a0\u00a0|\u00a0\u00a0
		[Pull geminicoder](command:yutools.dynamic-commands.openTerminalWithArgs?%7B%22terminalName%22%3A%22Git%20pull%20geminicoder%22%2C%22cwd%22%3A%22c%3A%5C%5Cai%5C%5Cyuagent%5C%5Cextensions%5C%5Cyu-servers%5C%5Cgeminicoder%22%2C%22commands%22%3A%5B%22pwd%22%2C%22git%20pull%22%5D%7D "Jalankan openTerminalWithArgs")
		`);

		tooltip.appendMarkdown('\n\n---\n\n');

		tooltip.appendMarkdown(`[Bangun yutools](command:yutools.dynamic-commands.openTerminalWithArgs?%7B%22terminalName%22%3A%22bangun%20yutools%22%2C%22cwd%22%3A%22c%3A%5C%5Cai%5C%5Cyuagent%5C%5Cextensions%5C%5Cyutools%22%2C%22commands%22%3A%5B%22pwd%22%2C%22bangun%22%5D%7D "Jalankan openTerminalWithArgs")`);

		tooltip.appendMarkdown('\n\n---\n\n');

		tooltip.appendMarkdown(`[npm run build:quick](command:yutools.dynamic-commands.openTerminalWithArgs?%7B%22terminalName%22%3A%22npm%20run%20build%3Aquick%20%40yugitlens%22%2C%22cwd%22%3A%22c%3A%5C%5Cai%5C%5Cyuagent%5C%5Cextensions%5C%5Cyugitlens%22%2C%22commands%22%3A%5B%22pwd%22%2C%22npm%20run%20build%3Aquick%22%5D%7D "npm run build:quick @yugitlens")
		\u00a0\u00a0|\u00a0\u00a0
		[Pull](command:yutools.dynamic-commands.openTerminalWithArgs?%7B%22terminalName%22%3A%22npm%20run%20build%3Aquick%20%40yugitlens%22%2C%22cwd%22%3A%22c%3A%5C%5Cai%5C%5Cyuagent%5C%5Cextensions%5C%5Cyugitlens%22%2C%22commands%22%3A%5B%22pwd%22%2C%22git%20pull%22%5D%7D "Jalankan openTerminalWithArgs")
		\u00a0\u00a0|\u00a0\u00a0
		yugitlens
		\u00a0\u00a0&mdash;\u00a0\u00a0
		[Bangun yuswe](command:yutools.dynamic-commands.openTerminalWithArgs?%7B%22terminalName%22%3A%22npm%20run%20compile%20%40sotaswe%22%2C%22cwd%22%3A%22C%3A%5C%5Cai%5C%5Cyuagent%5C%5Cextensions%5C%5Cyuswe%22%2C%22commands%22%3A%5B%22npm%20run%20compile%22%5D%7D "Jalankan openTerminalWithArgs")
		\u00a0\u00a0|\u00a0\u00a0
		sotaswe
		`);

		tooltip.appendMarkdown('\n\n---\n\n');
		tooltip.appendMarkdown(`[🔼](command:yutools.glassit_increase "Increase transparency")
		\u00a0\u00a0|\u00a0\u00a0
		[🔽](command:yutools.glassit_decrease "Decrease transparency")
		\u00a0\u00a0|\u00a0\u00a0
		[⚫](command:yutools.glassit_maximize "Maximize transparency")
		\u00a0\u00a0|\u00a0\u00a0
		[⚪](command:yutools.glassit_minimize "Minimize transparency")
		\u00a0\u00a0|\u00a0\u00a0
		[🟦](command:yutools.glassit_transparent "Transparent")
		`);

		tooltip.appendMarkdown('\n\n---\n\n');
		tooltip.appendMarkdown(`[Show Message](command:yutools.terminal.showMessage "Tampilkan message")
		\u00a0\u00a0|\u00a0\u00a0
		[Kill terminals](command:yutools.killAllTerminals "Kill all terminals")
		\u00a0\u00a0|\u00a0\u00a0
		[Chrome](command:yutools.visitChromeURL "Chrome")\u00a0\u00a0|\u00a0\u00a0[Firefox](command:yutools.visitFirefoxURL "Firefox")
		\n
		`);

		// if (
		// 	state === 'idle' ||
		// 	state === 'disconnected' ||
		// 	state === 'loading' ||
		// 	(state === 'load' && !this.hasInteracted())
		// ) {
		// 	tooltip.appendMarkdown('\n\n---\n\n');
		// 	tooltip.appendMarkdown(
		// 		'[Launchpad](command:gitlens.launchpad.indicator.action?%22info%22 "Learn about Launchpad") organizes your pull requests into actionable groups to help you focus and keep your team unblocked.',
		// 	);
		// 	tooltip.appendMarkdown(
		// 		"\n\nIt's always accessible using the `GitLens: Open Launchpad` command from the Command Palette.",
		// 	);
		// }
		this._statusBarLaunchpad.text = `⚡[U1]`;
		this._statusBarLaunchpad.tooltip = tooltip;
		this._statusBarLaunchpad.color = undefined;
		// switch (state) {
		// 	case 'idle':
		// 		this.clearRefreshTimer();
		// 		this._statusBarLaunchpad.text = '$(rocket)';
		// 		this._statusBarLaunchpad.tooltip = tooltip;
		// 		this._statusBarLaunchpad.color = undefined;
		// 		break;

		// 	case 'disconnected':
		// 		this.clearRefreshTimer();
		// 		tooltip.appendMarkdown(
		// 			`\n\n---\n\n[Connect an integration](command:gitlens.showLaunchpad?%7B%22source%22%3A%22launchpad-indicator%22%7D "Connect an integration") to get started.`,
		// 		);

		// 		this._statusBarLaunchpad.text = `$(rocket)$(gitlens-unplug) Launchpad`;
		// 		this._statusBarLaunchpad.tooltip = tooltip;
		// 		this._statusBarLaunchpad.color = undefined;
		// 		break;

		// 	case 'loading':
		// 		this.startRefreshTimer(0);
		// 		tooltip.appendMarkdown('\n\n---\n\n$(loading~spin) Loading...');

		// 		this._statusBarLaunchpad.text = '$(rocket)$(loading~spin)';
		// 		this._statusBarLaunchpad.tooltip = tooltip;
		// 		this._statusBarLaunchpad.color = undefined;
		// 		break;

		// 	case 'load':
		// 		this.updateStatusBarWithItems(tooltip, categorizedItems);
		// 		break;

		// 	case 'failed':
		// 		this.clearRefreshTimer();
		// 		tooltip.appendMarkdown('\n\n---\n\n$(alert) Unable to load items');

		// 		this._statusBarLaunchpad.text = '$(rocket)$(alert)';
		// 		this._statusBarLaunchpad.tooltip = tooltip;
		// 		this._statusBarLaunchpad.color = undefined;
		// 		break;
		// }

		// After the first state change, clear this
		this._firstStateAfterStartup = false;
	}

	private updateStatusBarCommand() {
		const labelType = configuration.get('launchpad.indicator.label') ?? 'item';
		this._statusBarLaunchpad.command = {
			title: 'Buka Commands',
			// C:\ai\yuagent\extensions\yugitlens\src\constants.commands.ts
			// ShowLaunchpad = 'gitlens.showLaunchpad',
			// command: GlCommand.ShowLaunchpad,
			command: 'yutools.picker.showCommandPicker',
			arguments: [
				{
					source: 'launchpad-indicator',
					state: { selectTopItem: labelType === 'item' },
				} satisfies Omit<LaunchpadCommandArgs, 'command'>,
			],
		};
	}

	private updateStatusBarWithItems(tooltip: MarkdownString, categorizedItems: LaunchpadItem[] | undefined) {
		this.sendTelemetryFirstLoadEvent();

		this._lastDataUpdate = new Date();
		const useColors = configuration.get('launchpad.indicator.useColors');
		const groups: LaunchpadGroup[] = configuration.get('launchpad.indicator.groups') ?? [];
		const labelType = configuration.get('launchpad.indicator.label') ?? 'item';
		const iconType = configuration.get('launchpad.indicator.icon') ?? 'default';

		let color: string | ThemeColor | undefined = undefined;
		let priorityIcon: `$(${string})` | undefined;
		let priorityItem: { item: LaunchpadItem; groupLabel: string } | undefined;

		const groupedItems = groupAndSortLaunchpadItems(categorizedItems);
		const totalGroupedItems = Array.from(groupedItems.values()).reduce((total, group) => total + group.length, 0);

		const hasImportantGroupsWithItems = groups.some(group => groupedItems.get(group)?.length);
		if (totalGroupedItems === 0) {
			tooltip.appendMarkdown('\n\n---\n\n');
			tooltip.appendMarkdown('You are all caught up!');
		} else if (!hasImportantGroupsWithItems) {
			tooltip.appendMarkdown('\n\n---\n\n');
			tooltip.appendMarkdown(
				`No pull requests need your attention\\\n(${totalGroupedItems} other pull requests)`,
			);
		} else {
			for (const group of groups) {
				const items = groupedItems.get(group);
				if (!items?.length) continue;

				if (tooltip.value.length > 0) {
					tooltip.appendMarkdown(`\n\n---\n\n`);
				}

				const icon = launchpadGroupIconMap.get(group)!;
				switch (group) {
					case 'mergeable': {
						priorityIcon ??= icon;
						color = new ThemeColor('gitlens.launchpadIndicatorMergeableColor' satisfies Colors);
						priorityItem ??= { item: items[0], groupLabel: 'can be merged' };
						tooltip.appendMarkdown(
							`<span style="color:var(--vscode-gitlens-launchpadIndicatorMergeableHoverColor);">${icon}</span>$(blank) [${
								labelType === 'item' && priorityItem != null
									? this.getPriorityItemLabel(priorityItem.item, items.length)
									: pluralize('pull request', items.length)
							} can be merged](command:gitlens.showLaunchpad?${encodeURIComponent(
								JSON.stringify({
									source: 'launchpad-indicator',
									state: {
										initialGroup: 'mergeable',
										selectTopItem: true,
									},
								} satisfies Omit<LaunchpadCommandArgs, 'command'>),
							)} "Open Ready to Merge in Launchpad")`,
						);
						break;
					}
					case 'blocked': {
						const action = groupByMap(items, i =>
							i.actionableCategory === 'failed-checks' ||
							i.actionableCategory === 'conflicts' ||
							i.actionableCategory === 'unassigned-reviewers'
								? i.actionableCategory
								: 'blocked',
						);

						const hasMultipleCategories = action.size > 1;

						let item: LaunchpadItem | undefined;
						let actionMessage = '';
						let summaryMessage = '(';

						let actionGroupItems = action.get('unassigned-reviewers');
						if (actionGroupItems?.length) {
							actionMessage = `${actionGroupItems.length > 1 ? 'need' : 'needs'} reviewers`;
							summaryMessage += `${actionGroupItems.length} ${actionMessage}`;
							item ??= actionGroupItems[0];
						}

						actionGroupItems = action.get('failed-checks');
						if (actionGroupItems?.length) {
							actionMessage = `failed CI checks`;
							summaryMessage += `${hasMultipleCategories ? ', ' : ''}${
								actionGroupItems.length
							} ${actionMessage}`;
							item ??= actionGroupItems[0];
						}

						actionGroupItems = action.get('conflicts');
						if (actionGroupItems?.length) {
							actionMessage = `${actionGroupItems.length > 1 ? 'have' : 'has'} conflicts`;
							summaryMessage += `${hasMultipleCategories ? ', ' : ''}${
								actionGroupItems.length
							} ${actionMessage}`;
							item ??= actionGroupItems[0];
						}

						summaryMessage += ')';

						priorityIcon ??= icon;
						color ??= new ThemeColor('gitlens.launchpadIndicatorBlockedColor' satisfies Colors);
						tooltip.appendMarkdown(
							`<span style="color:var(--vscode-gitlens-launchpadIndicatorBlockedColor);">${icon}</span>$(blank) [${
								labelType === 'item' && item != null && priorityItem == null
									? this.getPriorityItemLabel(item, items.length)
									: pluralize('pull request', items.length)
							} ${
								hasMultipleCategories ? 'are blocked' : actionMessage
							}](command:gitlens.showLaunchpad?${encodeURIComponent(
								JSON.stringify({
									source: 'launchpad-indicator',
									state: {
										initialGroup: 'blocked',
										selectTopItem: true,
									},
								} satisfies Omit<LaunchpadCommandArgs, 'command'>),
							)} "Open Blocked in Launchpad")`,
						);
						if (hasMultipleCategories) {
							tooltip.appendMarkdown(`\\\n$(blank)$(blank) ${summaryMessage}`);
						}

						if (item != null) {
							let label = 'is blocked';
							if (item.actionableCategory === 'unassigned-reviewers') {
								label = 'needs reviewers';
							} else if (item.actionableCategory === 'failed-checks') {
								label = 'failed CI checks';
							} else if (item.actionableCategory === 'conflicts') {
								label = 'has conflicts';
							}
							priorityItem ??= { item: item, groupLabel: label };
						}
						break;
					}
					case 'follow-up': {
						priorityIcon ??= icon;
						color ??= new ThemeColor('gitlens.launchpadIndicatorAttentionColor' satisfies Colors);
						tooltip.appendMarkdown(
							`<span style="color:var(--vscode-gitlens-launchpadIndicatorAttentionHoverColor);">${icon}</span>$(blank) [${
								labelType === 'item' && priorityItem == null && items.length
									? this.getPriorityItemLabel(items[0], items.length)
									: pluralize('pull request', items.length)
							} ${
								items.length > 1 ? 'require' : 'requires'
							} follow-up](command:gitlens.showLaunchpad?${encodeURIComponent(
								JSON.stringify({
									source: 'launchpad-indicator',
									state: {
										initialGroup: 'follow-up',
										selectTopItem: true,
									},
								} satisfies Omit<LaunchpadCommandArgs, 'command'>),
							)} "Open Follow-Up in Launchpad")`,
						);
						priorityItem ??= { item: items[0], groupLabel: 'requires follow-up' };
						break;
					}
					case 'needs-review': {
						priorityIcon ??= icon;
						color ??= new ThemeColor('gitlens.launchpadIndicatorAttentionColor' satisfies Colors);
						tooltip.appendMarkdown(
							`<span style="color:var(--vscode-gitlens-launchpadIndicatorAttentionHoverColor);">${icon}</span>$(blank) [${
								labelType === 'item' && priorityItem == null && items.length
									? this.getPriorityItemLabel(items[0], items.length)
									: pluralize('pull request', items.length)
							} ${
								items.length > 1 ? 'need' : 'needs'
							} your review](command:gitlens.showLaunchpad?${encodeURIComponent(
								JSON.stringify({
									source: 'launchpad-indicator',
									state: {
										initialGroup: 'needs-review',
										selectTopItem: true,
									},
								} satisfies Omit<LaunchpadCommandArgs, 'command'>),
							)} "Open Needs Your Review in Launchpad")`,
						);
						priorityItem ??= { item: items[0], groupLabel: 'needs your review' };
						break;
					}
				}
			}
		}

		const iconSegment = iconType === 'group' && priorityIcon != null ? priorityIcon : '$(rocket)';

		let labelSegment;
		// switch (labelType) {
		// 	case 'item':
		// 		labelSegment =
		// 			priorityItem != null
		// 				? ` ${this.getPriorityItemLabel(priorityItem.item)} ${priorityItem.groupLabel}`
		// 				: '';
		// 		break;

		// 	case 'counts':
		// 		labelSegment = '';
		// 		for (const group of groups) {
		// 			if (!launchpadPriorityGroups.includes(group)) continue;

		// 			const count = groupedItems.get(group)?.length ?? 0;
		// 			const icon = launchpadGroupIconMap.get(group)!;

		// 			labelSegment +=
		// 				!labelSegment && iconSegment === icon ? `\u00a0${count}` : `\u00a0\u00a0${icon} ${count}`;
		// 		}
		// 		break;

		// 	default:
		// 		labelSegment = '';
		// 		break;
		// }
		labelSegment = 'Yutools'

		this._statusBarLaunchpad.text = `${iconSegment}${labelSegment}`;
		this._statusBarLaunchpad.tooltip = tooltip;
		this._statusBarLaunchpad.color = useColors ? color : undefined;
	}

	private registerCommands(): Disposable[] {
		return [
			registerCommand('gitlens.launchpad.indicator.action', async (action: string) => {
				this.storeFirstInteractionIfNeeded();
				switch (action) {
					case 'info': {
						void executeCommand<OpenWalkthroughCommandArgs>(GlCommand.OpenWalkthrough, {
							step: 'accelerate-pr-reviews',
							source: 'launchpad-indicator',
							detail: 'info',
						});
						break;
					}
					case 'hide': {
						const hide = { title: 'Hide Anyway' };
						const cancel = { title: 'Cancel', isCloseAffordance: true };
						const action = await window.showInformationMessage(
							'GitLens Launchpad helps you focus and keep your team unblocked.\n\nAre you sure you want hide the indicator?',
							{
								modal: true,
								detail: '\nYou can always access Launchpad using the "GitLens: Open Launchpad" command, and can re-enable the indicator with the "GitLens: Toggle Launchpad Indicator" command.',
							},
							hide,
							cancel,
						);
						if (action === hide) {
							void configuration.updateEffective('launchpad.indicator.enabled', false);
						}
						break;
					}
					default:
						break;
				}
			}),
		];
	}

	private getPriorityItemLabel(item: LaunchpadItem, groupLength?: number) {
		return `${item.repository != null ? `${item.repository.owner.login}/${item.repository.name}` : ''}#${item.id}${
			groupLength != null && groupLength > 1
				? ` and ${pluralize('pull request', groupLength - 1, { infix: ' other ' })}`
				: ''
		}`;
	}

	private sendTelemetryFirstLoadEvent() {
		if (!this.container.telemetry.enabled) return;

		const hasLoaded = this.container.storage.get('launchpad:indicator:hasLoaded') ?? false;
		if (!hasLoaded) {
			void this.container.storage.store('launchpad:indicator:hasLoaded', true).catch();
			this.container.telemetry.sendEvent('launchpad/indicator/firstLoad');
		}
	}

	private storeFirstInteractionIfNeeded() {
		if (this.container.storage.get('launchpad:indicator:hasInteracted') != null) return;
		void this.container.storage.store('launchpad:indicator:hasInteracted', new Date().toISOString());
	}

	private hasInteracted() {
		return this.container.storage.get('launchpad:indicator:hasInteracted') != null;
	}
}

export interface LaunchpadSummaryResult {
	total: number;
	groups: LaunchpadGroup[];
	hasGroupedItems: boolean;

	mergeable?: {
		total: number;
	};

	blocked?: {
		total: number;

		blocked: number;
		conflicts: number;
		failedChecks: number;
		unassignedReviewers: number;
	};

	followUp?: {
		total: number;
	};
	needsReview?: {
		total: number;
	};

	snoozed?: {
		total: number;
		items: LaunchpadItem[];
	};
	pinned?: {
		total: number;
		items: LaunchpadItem[];
	};
}

export function generateLaunchpadSummary(
	items: LaunchpadItem[] | undefined,
	groups: LaunchpadGroup[],
): LaunchpadSummaryResult {
	const groupedItems = groupAndSortLaunchpadItems(items);
	const total = Array.from(groupedItems.values()).reduce((total, group) => total + group.length, 0);
	const hasGroupedItems = groups.some(group => groupedItems.get(group)?.length);

	if (total === 0 || !hasGroupedItems) {
		return { total: total, groups: groups, hasGroupedItems: false };
	}

	const result: LaunchpadSummaryResult = { total: total, groups: groups, hasGroupedItems: hasGroupedItems };

	for (const group of groups) {
		const itemsInGroup = groupedItems.get(group);
		if (!itemsInGroup?.length) continue;

		switch (group) {
			case 'mergeable':
				result.mergeable = { total: itemsInGroup.length };
				break;
			case 'blocked': {
				const grouped = groupByMap(itemsInGroup, i =>
					i.actionableCategory === 'failed-checks' ||
					i.actionableCategory === 'conflicts' ||
					i.actionableCategory === 'unassigned-reviewers'
						? i.actionableCategory
						: 'blocked',
				);

				result.blocked = {
					total: itemsInGroup.length,

					blocked: grouped.get('blocked')?.length ?? 0,
					conflicts: grouped.get('conflicts')?.length ?? 0,
					failedChecks: grouped.get('failed-checks')?.length ?? 0,
					unassignedReviewers: grouped.get('unassigned-reviewers')?.length ?? 0,
				};

				break;
			}
			case 'follow-up':
				result.followUp = { total: itemsInGroup.length };
				break;
			case 'needs-review':
				result.needsReview = { total: itemsInGroup.length };
				break;
			case 'snoozed':
				result.snoozed = { items: itemsInGroup, total: itemsInGroup.length };
				break;
			case 'pinned':
				result.pinned = { items: itemsInGroup, total: itemsInGroup.length };
				break;
		}
	}

	return result;
}
