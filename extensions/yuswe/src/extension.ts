import { uniqueId } from 'lodash';
import * as os from 'os';
import * as vscode from 'vscode';
import { AideAgentSessionProvider } from './core/completions/providers/aideAgentProvider';
import { PanelProvider } from './PanelProvider';
import postHogClient from './core/posthog/client';
import { RecentEditsRetriever } from './core/server/editedFiles';
import { RepoRef, RepoRefBackend, SideCarClient } from './core/sidecar/client';
import { TerminalManager } from './core/terminal/TerminalManager';
import { AideAgentMode } from './types';
import {
  checkOrKillRunningServer,
  getSidecarBinaryURL,
  // startSidecarBinary,
} from './core/utilities/setupSidecarBinary';
import { sidecarUseSelfRun } from './core/utilities/sidecarUrl';
import { getUniqueId } from './core/utilities/uniqueId';
import { ProjectContext } from './core/utilities/workspaceContext';
import { SimpleBrowserView } from './browser/simpleBrowserView';
import { SimpleBrowserManager } from './browser/simpleBrowserManager';
import { findPortPosition } from './utils/port';
import { ReactDevtoolsManager } from './devtools/react/DevtoolsManager';

const openApiCommand = 'sota-swe.api.open';
const showCommand = 'sota-swe.show-browser';

export let SIDECAR_CLIENT: SideCarClient | null = null;

/**
Extension → PanelProvider → Webview (app.tsx)
(native)     (bridge)       (UI layer)

Example flow:
1. Extension starts sidecar download
2. When ready, calls panelProvider.setSidecarReady()
3. PanelProvider sends message to webview
4. app.tsx receives message and updates UI
 */

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
  //const session = await vscode.csAuthentication.getSession();
  //const email = session?.account.email ?? '';
  postHogClient?.capture({
    distinctId: getUniqueId(),
    event: 'activate',
    properties: {
      platform: os.platform(),
      product: 'extension',
      email: 'test@test.com',
    },
  });

  // Create a terminal manager instance
  const terminalManager = new TerminalManager();

  const reactDevtoolsManager = new ReactDevtoolsManager();

  const panelProvider = new PanelProvider(context, terminalManager, reactDevtoolsManager);
  let rootPath = vscode.workspace.rootPath;
  if (!rootPath) {
    rootPath = '';
  }

  const currentRepo = new RepoRef(
    // We assume the root-path is the one we are interested in
    rootPath,
    RepoRefBackend.local
  );

  // We also get some context about the workspace we are in and what we are
  // upto
  const projectContext = new ProjectContext();
  await projectContext.collectContext();

  // add the recent edits retriver to the subscriptions
  // so we can grab the recent edits very quickly
  const recentEditsRetriever = new RecentEditsRetriever(300 * 1000, vscode.workspace);
  context.subscriptions.push(recentEditsRetriever);

  // Register the agent session provider
  const agentSessionProvider = new AideAgentSessionProvider(
    currentRepo,
    projectContext,
    recentEditsRetriever,
    context,
    panelProvider,
    terminalManager
  );
  context.subscriptions.push(agentSessionProvider);

  // Show the panel immediately
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('sota-swe-panel', panelProvider)
  );

  console.log('gagalkan sidecar download dan invocation di yuswe');
  // console.log('extension:will start sidecar binary');
  // // sidecar binary download in background
  // startSidecarBinary(context.globalStorageUri.fsPath, panelProvider)
  //   .then(async (sidecarUrl) => {
  //     const sidecarClient = new SideCarClient(sidecarUrl);
  //     // Perform a health check
  //     await sidecarClient.healthCheck();

  //     // Tell the PanelProvider that the sidecar is ready
  //     panelProvider.setSidecarClient(sidecarClient);
  //     SIDECAR_CLIENT = sidecarClient;
  //   })
  //   .catch((error) => {
  //     console.error('Failed to start sidecar:', error);
  //     vscode.window.showErrorMessage('Failed to start sidecar for SOTA SWE extension');
  //   });

  context.subscriptions.push(
    panelProvider.onMessageFromWebview(async (message) => {
      // console.log('message from webview', message);
      if (message.type === 'task-feedback') {
        try {
          // here we get the message from the user
          const query = message.query;
          const sessionId = message.sessionId;
          const webviewVariables = message.variables;
          const base64Images = message.images;

          // Convert variables to VSCode format
          const variables: vscode.ChatPromptReference[] = await Promise.all(
            webviewVariables
              .filter((v) => v.id.providerTitle === 'file')
              .map(async (v) => {
                const uri = vscode.Uri.parse(v.uri!.value);
                const document = await vscode.workspace.openTextDocument(uri);
                const range = new vscode.Range(
                  document.positionAt(0),
                  document.positionAt(document.getText().length)
                );

                return {
                  id: 'vscode.file',
                  value: { uri, range },
                };
              })
          );

          // something will create the exchange id
          const exchangeId = uniqueId();
          panelProvider.addExchangeRequest(sessionId, exchangeId, query);

          const { model, provider } = message.modelSelection;

          const modelSelection = {
            slowModel: model,
            fastModel: model,
            models: {
              [model]: {
                name: model,
                contextLength: 10000,
                temperature: 0.2,
                provider: {
                  type: provider.name,
                },
              },
            },
            providers: {
              [provider.name]: {
                name: provider.name,
                apiBase: provider.apiBase,
                apiKey: provider.apiKey,
              },
            },
          };

          console.log('model selection', modelSelection);

          panelProvider.setTaskStatus(message.sessionId, false);

          console.log('set task status', message.sessionId);
          // - ping the sidecar over here. currentRepo can be undefined, which will 422 sidecar
          const stream = SIDECAR_CLIENT!.agentSessionPlanStep(
            query,
            sessionId,
            exchangeId,
            agentSessionProvider.editorUrl!,
            AideAgentMode.Chat,
            variables,
            currentRepo ?? '',
            projectContext.labels,
            false,
            'workos-fake-id',
            modelSelection,
            base64Images
          );
          // - have a respose somewhere and the chat model would update
          await agentSessionProvider.reportAgentEventsToChat(true, stream);

          panelProvider.setTaskStatus(message.sessionId, true);
          // and the model will have a on did change
          // - the extension needs the state
          // - on did change chat model gets back over here

        } catch (error) {
          console.error('Error handling message from webview:', error);
        }
      }

      if (message.type === 'cancel-request') {
        agentSessionProvider.cancelAllExchangesForSession(message.sessionId);
      }

      if (message.type === 'open-file') {
        try {
          const uri = vscode.Uri.parse(message.fs_file_path);
          const document = await vscode.workspace.openTextDocument(uri);
          await vscode.window.showTextDocument(document);
          console.log('file opened');
        } catch (err) {
          console.error(`Could not find file with path ${message.fs_file_path}`);
        }
      }
    })
  );

  context.subscriptions.push(
    panelProvider.onDidWebviewBecomeVisible(() => {
      // @theskcd we update the view state here
      panelProvider.updateState();
    })
  );

  const manager = new SimpleBrowserManager(context.extensionUri);
  context.subscriptions.push(manager);

  context.subscriptions.push(vscode.window.registerWebviewPanelSerializer(SimpleBrowserView.viewType, {
    deserializeWebviewPanel: async (panel, state) => {
      console.log('deserialize webview panel ', state);
      manager.restore(panel, state);
    }
  }));

  context.subscriptions.push(vscode.commands.registerCommand(showCommand, async (url?: string) => {

    const prefilledUrl = 'http://localhost:3000';
    const portPosition = findPortPosition(prefilledUrl);

    if (!url) {
      url = await vscode.window.showInputBox({
        placeHolder: vscode.l10n.t("https://localhost:3000"),
        value: prefilledUrl,
        valueSelection: portPosition ? [portPosition.start, portPosition.end] : undefined,
        prompt: vscode.l10n.t("Insert the url of your dev server")
      });
    }

    if (url) {
      try {
        const parsedUrl = new URL(url);
        if (reactDevtoolsManager.status === 'server-connected') {
          const proxyedPort = await reactDevtoolsManager.proxy(Number(parsedUrl.port));
          const proxyedUrl = new URL(parsedUrl);
          proxyedUrl.port = proxyedPort.toString();
          manager.show(proxyedUrl.href);
        } else {
          console.error('Devtools are not ready');
        }
      } catch (err) {
        vscode.window.showErrorMessage('The URL you provided is not valid');
      }
    }
  }));

  context.subscriptions.push(vscode.commands.registerCommand(openApiCommand, (url: vscode.Uri, showOptions?: {
    preserveFocus?: boolean;
    viewColumn: vscode.ViewColumn;
  }) => {
    manager.show(url, showOptions);
  }));

  // window.createStatusBarItem('gitlens.launchpad', StatusBarAlignment.Left, 10000 - 3);
  const yutools_status_bar1: vscode.StatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  yutools_status_bar1.name = "U2"
  yutools_status_bar1.text = "🟩[U2]"

  const tooltip = new vscode.MarkdownString('', true);
  tooltip.supportHtml = true;
  tooltip.isTrusted = true;
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

  tooltip.appendMarkdown(`[ASSEMBLYAI_API_KEYS.json](command:yutools.dynamic-commands.openDynamicFile?%7B%22filePath%22%3A%22C%3A%5C%5CUsers%5C%5Cusef%5C%5CASSEMBLYAI_API_KEYS.json%22%7D "ASSEMBLYAI_API_KEYS")
  \u00a0\u00a0&mdash;\u00a0\u00a0
  [assemblyai](command:yutools.dynamic-commands.openDynamicUrl?%7B%22url%22%3A%22https%3A%2F%2Fwww.assemblyai.com%2Fdashboard%2Fsignup%22%7D "Buka URL https://www.assemblyai.com/dashboard/signup")
  \u00a0\u00a0|\u00a0\u00a0
  [CEREBRAS_API_KEYS.json](command:yutools.dynamic-commands.openDynamicFile?%7B%22filePath%22%3A%22C%3A%5C%5CUsers%5C%5Cusef%5C%5CCEREBRAS_API_KEYS.json%22%7D "CEREBRAS_API_KEYS")
  \u00a0\u00a0&mdash;\u00a0\u00a0
  [cerebras](command:yutools.dynamic-commands.openDynamicUrl?%7B%22url%22%3A%22https%3A%2F%2Fcloud.cerebras.ai%2F%3Fredirect%3D%2Fplatform%22%7D "https://cloud.cerebras.ai/?redirect=/platform")
  \u00a0\u00a0&mdash;\u00a0\u00a0 Silo+SL
  \u00a0\u00a0|\u00a0\u00a0
  [COHERE_API_KEYS.json](command:yutools.dynamic-commands.openDynamicFile?%7B%22filePath%22%3A%22C%3A%5C%5CUsers%5C%5Cusef%5C%5CCOHERE_API_KEYS.json%22%7D "COHERE_API_KEYS")
  \u00a0\u00a0&mdash;\u00a0\u00a0
  [Cohere](command:yutools.dynamic-commands.openDynamicUrl?%7B%22url%22%3A%22https%3A%2F%2Fdashboard.cohere.com%2Fapi-keys%22%7D "https://dashboard.cohere.com/api-keys")
  \u00a0\u00a0&mdash;\u00a0\u00a0 Silo+SL+Simple
  \u00a0\u00a0|\u00a0\u00a0
  [FALAI_API_KEYS.json](command:yutools.dynamic-commands.openDynamicFile?%7B%22filePath%22%3A%22C%3A%5C%5CUsers%5C%5Cusef%5C%5CFALAI_API_KEYS.json%22%7D "FALAI_API_KEYS")
  \u00a0\u00a0&mdash;\u00a0\u00a0
  [Fal.ai](command:yutools.dynamic-commands.openDynamicUrl?%7B%22url%22%3A%22https%3A%2F%2Ffal.ai%2Fdashboard%22%7D "https://fal.ai/dashboard")
  \u00a0\u00a0&mdash;\u00a0\u00a0 GH
  \u00a0\u00a0|\u00a0\u00a0
  [FIREWORKS_API_KEYS.json](command:yutools.dynamic-commands.openDynamicFile?%7B%22filePath%22%3A%22C%3A%5C%5CUsers%5C%5Cusef%5C%5CFIREWORKS_API_KEYS.json%22%7D "FIREWORKS_API_KEYS")
  \u00a0\u00a0&mdash;\u00a0\u00a0
  [Fireworks](command:yutools.dynamic-commands.openDynamicUrl?%7B%22url%22%3A%22https%3A%2F%2Ffireworks.ai%2Flogin%22%7D "https://fireworks.ai/login")
  \u00a0\u00a0&mdash;\u00a0\u00a0 GM
  \u00a0\u00a0|\u00a0\u00a0
  [GLHF_API_KEYS.json](command:yutools.dynamic-commands.openDynamicFile?%7B%22filePath%22%3A%22C%3A%5C%5CUsers%5C%5Cusef%5C%5CGLHF_API_KEYS.json%22%7D "GLHF_API_KEYS")
  \u00a0\u00a0&mdash;\u00a0\u00a0
  [GLHF](command:yutools.dynamic-commands.openDynamicUrl?%7B%22url%22%3A%22https%3A%2F%2Fglhf.chat%2Fusers%2Fcreate%22%7D "https://glhf.chat/users/create")
  \u00a0\u00a0&mdash;\u00a0\u00a0 Silo+Simple
  \u00a0\u00a0|\u00a0\u00a0
  [GOOGLE_GEMINI_API_KEYS.json](command:yutools.dynamic-commands.openDynamicFile?%7B%22filePath%22%3A%22C%3A%5C%5CUsers%5C%5Cusef%5C%5CGOOGLE_GEMINI_API_KEYS.json%22%7D "GOOGLE_GEMINI_API_KEYS")
  \u00a0\u00a0|\u00a0\u00a0
  [GROQ_API_KEYS.json](command:yutools.dynamic-commands.openDynamicFile?%7B%22filePath%22%3A%22C%3A%5C%5CUsers%5C%5Cusef%5C%5CGROQ_API_KEYS.json%22%7D "GROQ_API_KEYS")
  \u00a0\u00a0&mdash;\u00a0\u00a0
  [Groq](command:yutools.dynamic-commands.openDynamicUrl?%7B%22url%22%3A%22https%3A%2F%2Fconsole.groq.com%2Fkeys%22%7D "https://console.groq.com/keys")
  \u00a0\u00a0&mdash;\u00a0\u00a0 Silo
  \u00a0\u00a0|\u00a0\u00a0
  [HUGGINGFACE_API_KEYS.json](command:yutools.dynamic-commands.openDynamicFile?%7B%22filePath%22%3A%22C%3A%5C%5CUsers%5C%5Cusef%5C%5CHUGGINGFACE_API_KEYS.json%22%7D "HUGGINGFACE_API_KEYS")
  \u00a0\u00a0&mdash;\u00a0\u00a0
  [HF](command:yutools.dynamic-commands.openDynamicUrl?%7B%22url%22%3A%22https%3A%2F%2Fhuggingface.co%2Fjoin%22%7D "https://huggingface.co/join")
  \u00a0\u00a0&mdash;\u00a0\u00a0 SL+Simple
  \u00a0\u00a0|\u00a0\u00a0
  [HYPERBOLIC_API_KEYS.json](command:yutools.dynamic-commands.openDynamicFile?%7B%22filePath%22%3A%22C%3A%5C%5CUsers%5C%5Cusef%5C%5CHYPERBOLIC_API_KEYS.json%22%7D "HYPERBOLIC_API_KEYS")
  \u00a0\u00a0&mdash;\u00a0\u00a0
  [Hyperbolic](command:yutools.dynamic-commands.openDynamicUrl?%7B%22url%22%3A%22https%3A%2F%2Fapp.hyperbolic.xyz%2F%22%7D "https://app.hyperbolic.xyz/")
  \u00a0\u00a0&mdash;\u00a0\u00a0 SL
  \u00a0\u00a0|\u00a0\u00a0
  [N8N_API_KEYS.json](command:yutools.dynamic-commands.openDynamicFile?%7B%22filePath%22%3A%22C%3A%5C%5CUsers%5C%5Cusef%5C%5CN8N_API_KEYS.json%22%7D "N8N_API_KEYS")
  \u00a0\u00a0&mdash;\u00a0\u00a0
  [N8N](command:yutools.dynamic-commands.openDynamicUrl?%7B%22url%22%3A%22https%3A%2F%2Fapp.n8n.cloud%2Fregister%22%7D "https://app.n8n.cloud/register")
  \u00a0\u00a0|\u00a0\u00a0
  [OPENAI_API_KEYS.json](command:yutools.dynamic-commands.openDynamicFile?%7B%22filePath%22%3A%22C%3A%5C%5CUsers%5C%5Cusef%5C%5COPENAI_API_KEYS.json%22%7D "OPENAI_API_KEYS")
  \u00a0\u00a0|\u00a0\u00a0
  [SAMBANOVA_API_KEYS.json](command:yutools.dynamic-commands.openDynamicFile?%7B%22filePath%22%3A%22C%3A%5C%5CUsers%5C%5Cusef%5C%5CSAMBANOVA_API_KEYS.json%22%7D "SAMBANOVA_API_KEYS")
  \u00a0\u00a0&mdash;\u00a0\u00a0
  [Sambanova](command:yutools.dynamic-commands.openDynamicUrl?%7B%22url%22%3A%22https%3A%2F%2Fcloud.sambanova.ai%2Fapis%22%7D "https://cloud.sambanova.ai/apis")
  \u00a0\u00a0|\u00a0\u00a0
  [TOGETHER_API_KEYS.json](command:yutools.dynamic-commands.openDynamicFile?%7B%22filePath%22%3A%22C%3A%5C%5CUsers%5C%5Cusef%5C%5CTOGETHER_API_KEYS.json%22%7D "TOGETHER_API_KEYS")
  \u00a0\u00a0&mdash;\u00a0\u00a0
  [Together](command:yutools.dynamic-commands.openDynamicUrl?%7B%22url%22%3A%22https%3A%2F%2Fapi.together.xyz%2Fsignin%22%7D "https://api.together.xyz/signin")
  \u00a0\u00a0&mdash;\u00a0\u00a0 GH+GM
  \u00a0\u00a0|\u00a0\u00a0
  [XAI_API_KEYS.json](command:yutools.dynamic-commands.openDynamicFile?%7B%22filePath%22%3A%22C%3A%5C%5CUsers%5C%5Cusef%5C%5CXAI_API_KEYS.json%22%7D "XAI_API_KEYS")
  \u00a0\u00a0&mdash;\u00a0\u00a0
  [xai](command:yutools.dynamic-commands.openDynamicUrl?%7B%22url%22%3A%22https%3A%2F%2Faccounts.x.ai%2Fsign-up%3Fredirect%3Dcloud-console%22%7D "https://accounts.x.ai/sign-up?redirect=cloud-console")
  `);

  tooltip.appendMarkdown('\n\n---\n\n');
  tooltip.appendMarkdown(`[Search Google](command:yutools.browserAutomation.searchGoogle)
  \u00a0\u00a0|\u00a0\u00a0
  [NYTimes](command:yutools.browserAutomation.screenshotNYTimes "Screenshot NYT")
  \u00a0\u00a0|\u00a0\u00a0
  [Lovable](command:yutools.browserAutomation.loginLovable "Lovable login")
  \u00a0\u00a0|\u00a0\u00a0
  [Lovable: enterprise app](command:yutools.browserAutomation.lovable.randomEnterpriseApp "Lovable enterprise app")
  \u00a0\u00a0|\u00a0\u00a0
  [Lovable: handle github](command:yutools.browserAutomation.lovable.handleGitHubAuth "Lovable github")
  \u00a0\u00a0|\u00a0\u00a0
  [Lovable: handle supabase](command:yutools.browserAutomation.lovable.handleSupabaseDropdown "Lovable supabase")
  \u00a0\u00a0|\u00a0\u00a0
  [DataButton+GM](command:yutools.browserAutomation.loginDatabuttonAndOpenGmail "DataButton")
  \u00a0\u00a0|\u00a0\u00a0
  [DataButton: enterprise app](command:yutools.browserAutomation.databutton.newAppRandomEnterpriseApp "Databutton enterprise app")
  \u00a0\u00a0|\u00a0\u00a0
  [Bolt](command:yutools.browserAutomation.stackblitzAndBoltAutomationTry2 "Bolt.new")
  \u00a0\u00a0|\u00a0\u00a0
  [Bolt: enterprise app](command:yutools.browserAutomation.lovable.randomEnterpriseApp "Bolt enterprise app")
  \u00a0\u00a0|\u00a0\u00a0
  [DS Artifacts Manual](command:yutools.browserAutomation.generateFullstackApp "DeepSeek Artifacts")
  \u00a0\u00a0|\u00a0\u00a0
  [DS Artifacts Auto](command:yutools.browserAutomation.dsArtifactRandomEnterpriseApp "DeepSeek Artifacts")
  \u00a0\u00a0|\u00a0\u00a0
  [LLM job ad](command:yutools.prompts.replaceAndInvokeJobAdLLM "LLM job ad")
  \u00a0\u00a0|\u00a0\u00a0
  [Github Signup](command:yutools.browserAutomation.github.automateGithubSignup "automateGithubSignup")
  \u00a0\u00a0|\u00a0\u00a0
  [Railway Signup](command:yutools.browserAutomation.railway.automateRailwayLogin "automateRailwayLogin")
  `);

  tooltip.appendMarkdown('\n\n---\n\n');
  tooltip.appendMarkdown(`Accounts:\u00a0\u00a0
  [github](command:yutools.dynamic-commands.openDynamicFile?%7B%22filePath%22%3A%22C%3A%5C%5CUsers%5C%5Cusef%5C%5Caccounts-github.json%22%7D "Buka File di editor")
  \u00a0\u00a0|\u00a0\u00a0
  [bolt](command:yutools.dynamic-commands.openDynamicFile?%7B%22filePath%22%3A%22C%3A%5C%5CUsers%5C%5Cusef%5C%5Caccounts-bolt.json%22%7D "Buka File di editor")
  \u00a0\u00a0|\u00a0\u00a0
  [lovable](command:yutools.dynamic-commands.openDynamicFile?%7B%22filePath%22%3A%22C%3A%5C%5CUsers%5C%5Cusef%5C%5Caccounts-lovable.json%22%7D "Buka File di editor")
  \u00a0\u00a0|\u00a0\u00a0
  [databutton](command:yutools.dynamic-commands.openDynamicFile?%7B%22filePath%22%3A%22C%3A%5C%5CUsers%5C%5Cusef%5C%5Caccounts-databutton.json%22%7D "Buka File di editor")
  \u00a0\u00a0|\u00a0\u00a0
  [supabase](command:yutools.dynamic-commands.openDynamicFile?%7B%22filePath%22%3A%22C%3A%5C%5CUsers%5C%5Cusef%5C%5Caccounts-supabase.json%22%7D "Buka File di editor")
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

  yutools_status_bar1.tooltip = tooltip;
  // yutools_status_bar1.command = `yutools.open_folder_to_set_cwd`;
  // yutools_status_bar1.command = {
  //   title: 'Open Launchpad',
  //   command: GlCommand.ShowLaunchpad,
  //   arguments: [
  //     {
  //       source: 'launchpad-indicator',
  //       state: { selectTopItem: labelType === 'item' },
  //     } satisfies Omit<LaunchpadCommandArgs, 'command'>,
  //   ],
  // };
	yutools_status_bar1.show();
  context.subscriptions.push(yutools_status_bar1);


  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////


  const yutools_status_bar2: vscode.StatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  yutools_status_bar2.name = "U3"
  yutools_status_bar2.text = "🟪[U3]"
  const tooltip2 = new vscode.MarkdownString('', true);
  tooltip2.supportHtml = true;
  tooltip2.isTrusted = true;

  tooltip2.appendMarkdown(`[9000](command:yutools.dynamic-commands.openDynamicUrl?%7B%22url%22%3A%22http%3A%2F%2Flocalhost%3A9000%22%7D "Buka URL di browser")
  \u00a0\u00a0|\u00a0\u00a0
  [8080](command:yutools.dynamic-commands.openDynamicUrl?%7B%22url%22%3A%22http%3A%2F%2Flocalhost%3A8080%22%7D "Buka URL di browser")
  \u00a0\u00a0|\u00a0\u00a0
  [8000](command:yutools.dynamic-commands.openDynamicUrl?%7B%22url%22%3A%22http%3A%2F%2Flocalhost%3A8000%22%7D "Buka URL di browser")
  \u00a0\u00a0|\u00a0\u00a0
  [7000](command:yutools.dynamic-commands.openDynamicUrl?%7B%22url%22%3A%22http%3A%2F%2Flocalhost%3A7000%22%7D "Buka URL di browser")
  \u00a0\u00a0|\u00a0\u00a0
  [6000](command:yutools.dynamic-commands.openDynamicUrl?%7B%22url%22%3A%22http%3A%2F%2Flocalhost%3A6000%22%7D "Buka URL di browser")
  \u00a0\u00a0|\u00a0\u00a0
  [5173](command:yutools.dynamic-commands.openDynamicUrl?%7B%22url%22%3A%22http%3A%2F%2Flocalhost%3A5173%22%7D "Buka URL di browser")
  \u00a0\u00a0|\u00a0\u00a0
  [5000](command:yutools.dynamic-commands.openDynamicUrl?%7B%22url%22%3A%22http%3A%2F%2Flocalhost%3A5000%22%7D "Buka URL di browser")
  \u00a0\u00a0|\u00a0\u00a0
  [4000](command:yutools.dynamic-commands.openDynamicUrl?%7B%22url%22%3A%22http%3A%2F%2Flocalhost%3A4000%22%7D "Buka URL di browser")
  \u00a0\u00a0|\u00a0\u00a0
  [3000](command:yutools.dynamic-commands.openDynamicUrl?%7B%22url%22%3A%22http%3A%2F%2Flocalhost%3A3000%22%7D "Buka URL di browser")
  `);

  tooltip2.appendMarkdown('\n\n---\n\n');

  tooltip2.appendMarkdown(`[Search Google](command:yutools.browserAutomation.searchGoogle)
  \u00a0\u00a0|\u00a0\u00a0
  [NYTimes](command:yutools.browserAutomation.screenshotNYTimes "Screenshot NYT")
  \u00a0\u00a0|\u00a0\u00a0
  [Lovable](command:yutools.browserAutomation.loginLovable "Lovable")
  \u00a0\u00a0|\u00a0\u00a0
  [DataButton+GM](command:yutools.browserAutomation.loginDatabuttonAndOpenGmail "DataButton")
  \u00a0\u00a0|\u00a0\u00a0
  [Bolt](command:yutools.browserAutomation.stackblitzAndBoltAutomationTry2 "Bolt.new")
  \u00a0\u00a0|\u00a0\u00a0
  [DeepSeek Artifacts](command:yutools.browserAutomation.generateFullstackApp "DeepSeek Artifacts")
  `);

  tooltip2.appendMarkdown('\n\n---\n\n');

  tooltip2.appendMarkdown(`[Bangun yutools](command:yutools.dynamic-commands.openTerminalWithArgs?%7B%22terminalName%22%3A%22bangun%20yutools%22%2C%22cwd%22%3A%22c%3A%5C%5Cai%5C%5Cyuagent%5C%5Cextensions%5C%5Cyutools%22%2C%22commands%22%3A%5B%22pwd%22%2C%22bangun%22%5D%7D "Jalankan openTerminalWithArgs")
  \u00a0\u00a0|\u00a0\u00a0
  [Bangun yulens](command:yutools.dynamic-commands.openTerminalWithArgs?%7B%22terminalName%22%3A%22npm%20run%20build%3Aquick%20%40yugitlens%22%2C%22cwd%22%3A%22c%3A%5C%5Cai%5C%5Cyuagent%5C%5Cextensions%5C%5Cyugitlens%22%2C%22commands%22%3A%5B%22pwd%22%2C%22npm%20run%20build%3Aquick%22%5D%7D "npm run build:quick @yugitlens")
  \u00a0\u00a0|\u00a0\u00a0
  [Bangun yuswe](command:yutools.dynamic-commands.openTerminalWithArgs?%7B%22terminalName%22%3A%22npm%20run%20compile%20%40sotaswe%22%2C%22cwd%22%3A%22C%3A%5C%5Cai%5C%5Cyuagent%5C%5Cextensions%5C%5Cyuswe%22%2C%22commands%22%3A%5B%22npm%20run%20compile%22%5D%7D "Jalankan openTerminalWithArgs")
  `);

  tooltip2.appendMarkdown('\n\n---\n\n');

  tooltip2.appendMarkdown(`[DS](command:yutools.dynamic-commands.openDynamicUrl?%7B%22url%22%3A%22https%3A%2F%2Fchat.deepseek.com%2F%22%7D "https://chat.deepseek.com/")
    \u00a0\u00a0|\u00a0\u00a0
    [CG](command:yutools.dynamic-commands.openDynamicUrl?%7B%22url%22%3A%22https%3A%2F%2Fchatgpt.com%2F%22%7D "https://chatgpt.com/")
    \u00a0\u00a0|\u00a0\u00a0
    [Simple](command:yutools.dynamic-commands.openDynamicUrl?%7B%22url%22%3A%22https%3A%2F%2Fapp.simplelogin.io%2Fdashboard%2F%22%7D "https://app.simplelogin.io/dashboard/")
  `);

  tooltip2.appendMarkdown('\n\n---\n\n');

  tooltip2.appendMarkdown(`[Twitter/elon](command:yutools.visitURL?%7B%22browser%22%3A%22chrome%22%2C%22profile%22%3A%22Profile%204%22%2C%22url%22%3A%22https%3A%2F%2Fx.com%22%7D "Buka Twitter akun elonmusk")
    \u00a0\u00a0|\u00a0\u00a0
    [IDX/yu314](command:yutools.visitURL?%7B%22browser%22%3A%22chrome%22%2C%22profile%22%3A%22Profile%208%22%2C%22url%22%3A%22https%3A%2F%2Fidx.google.com%2F%22%7D "visit URL")
    \u00a0\u00a0|\u00a0\u00a0
    [v0/yu314](command:yutools.visitURL?%7B%22browser%22%3A%22chrome%22%2C%22profile%22%3A%22Profile%208%22%2C%22url%22%3A%22https%3A%2F%2Fv0.dev%2F%22%7D "visit URL")
    \u00a0\u00a0|\u00a0\u00a0
    [Claude/yu314](command:yutools.visitURL?%7B%22browser%22%3A%22chrome%22%2C%22profile%22%3A%22Profile%208%22%2C%22url%22%3A%22https%3A%2F%2Fclaude.ai%2Fnew%22%7D "visit URL")
    \u00a0\u00a0|\u00a0\u00a0
    [upwork](command:yutools.visitURL?%7B%22privateMode%22%3Afalse%2C%22urls%22%3A%5B%22https%3A%2F%2Fmail.google.com%2Fmail%2Fu%2F0%2F%23inbox%22%2C%22https%3A%2F%2Fwww.upwork.com%2Fnx%2Ffind-work%2Fmost-recent%22%5D%7D "open upwork for yu314")
    \u00a0\u00a0|\u00a0\u00a0
    [jyw OAI billing](command:yutools.visitURL?%7B%22browser%22%3A%22chrome%22%2C%22profile%22%3A%22Profile%2012%22%2C%22url%22%3A%22https%3A%2F%2Fplatform.openai.com%2Fsettings%2Forganization%2Fbilling%2Foverview%22%7D "https://platform.openai.com/settings/organization/billing/overview")
  `);

  tooltip2.appendMarkdown('\n\n---\n\n');

  tooltip2.appendMarkdown(`[➕pass](command:yutools.db.zendb.addPassword "password add")
  \u00a0\u00a0&mdash;\u00a0\u00a0
  [📚pass](command:yutools.db.zendb.listPasswords "password list")
  \u00a0\u00a0&mdash;\u00a0\u00a0
  [✏️pass](command:yutools.db.zendb.updatePassword "password update")
  \u00a0\u00a0&mdash;\u00a0\u00a0
  [❌pass](command:yutools.db.zendb.deletePassword "password delete")
  \u00a0\u00a0|\u00a0\u00a0
  [➕snip](command:yutools.db.quicksnip.save "quicksnip add")
  \u00a0\u00a0&mdash;\u00a0\u00a0
  [📚snip](command:yutools.db.quicksnip.list "quicksnip list")
  \u00a0\u00a0&mdash;\u00a0\u00a0
  [✏️snip](command:yutools.db.quicksnip.search "quicksnip update")
  \u00a0\u00a0&mdash;\u00a0\u00a0
  [❌snip](command:yutools.db.quicksnip.delete "quicksnip delete")
  `);

  tooltip2.appendMarkdown('\n\n---\n\n');

  tooltip2.appendMarkdown(`[browse/profile](command:yutools.browsers.openBrowserWithProfile?%7B%22privateMode%22%3Afalse%2C%22urls%22%3A%5B%22https%3A%2F%2Fgithub.com%2Flogin%22%2C%22https%3A%2F%2Frailway.com%2Fnew%22%2C%22https%3A%2F%2Fapi.together.xyz%2Fsignin%22%5D%7D "openBrowserWithProfile - profile")
  \u00a0\u00a0|\u00a0\u00a0
  [browse/private](command:yutools.browsers.openBrowserWithProfile?%7B%22privateMode%22%3Atrue%2C%22urls%22%3A%5B%22https%3A%2F%2Fgithub.com%2Flogin%22%2C%22https%3A%2F%2Frailway.com%2Fnew%22%2C%22https%3A%2F%2Fapi.together.xyz%2Fsignin%22%5D%7D "openBrowserWithProfile - private mode")
  `);

  yutools_status_bar2.tooltip = tooltip2;
	yutools_status_bar2.show();
  context.subscriptions.push(yutools_status_bar2);

  ///////////////////
  /////////////////// 🟥 🟧 🟨 🟩 🟦 🟪 🟫 ⬛ ⬜
  /////////////////// 🔴 🟠 🟡 🟢 🔵 🟣 ⚪ ⚫
  /////////////////// 🀄 🎴 🖼️ 📛 🆓
  const yutools_status_bar3: vscode.StatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  yutools_status_bar3.name = "G"
  yutools_status_bar3.text = "🟫[G]"
  const tooltip3 = new vscode.MarkdownString('', true);
  tooltip3.supportHtml = true;
  tooltip3.isTrusted = true;
  // tooltip3.appendMarkdown('\n\n---\n\n');
  tooltip3.appendMarkdown(`[Chrome](command:yutools.visitChromeURL "Chrome")\u00a0\u00a0|\u00a0\u00a0[Firefox](command:yutools.visitFirefoxURL "Firefox")`);
  yutools_status_bar3.tooltip = tooltip3;
	yutools_status_bar3.show();
  context.subscriptions.push(yutools_status_bar3);
  ///////////////////
  const yutools_status_bar4: vscode.StatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  yutools_status_bar4.name = "D"
  yutools_status_bar4.text = "🟨[D]"
  const tooltip4 = new vscode.MarkdownString('', true);
  tooltip4.supportHtml = true;
  tooltip4.isTrusted = true;
  // tooltip4.appendMarkdown('\n\n---\n\n');
  tooltip4.appendMarkdown(`[Chrome](command:yutools.visitChromeURL "Chrome")\u00a0\u00a0|\u00a0\u00a0[Firefox](command:yutools.visitFirefoxURL "Firefox")`);
  yutools_status_bar4.tooltip = tooltip4;
	yutools_status_bar4.show();
  context.subscriptions.push(yutools_status_bar4);
  ///////////////////
  const yutools_status_bar5: vscode.StatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  yutools_status_bar5.name = "K"
  yutools_status_bar5.text = "🟧[K]"
  const tooltip5 = new vscode.MarkdownString('', true);
  tooltip5.supportHtml = true;
  tooltip5.isTrusted = true;
  // tooltip5.appendMarkdown('\n\n---\n\n');
  tooltip5.appendMarkdown(`[Chrome](command:yutools.visitChromeURL "Chrome")\u00a0\u00a0|\u00a0\u00a0[Firefox](command:yutools.visitFirefoxURL "Firefox")`);
  yutools_status_bar5.tooltip = tooltip5;
	yutools_status_bar5.show();
  context.subscriptions.push(yutools_status_bar5);
  ///////////////////
  const yutools_status_bar6: vscode.StatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  yutools_status_bar6.name = "T"
  yutools_status_bar6.text = "🟥[T]"
  const tooltip6 = new vscode.MarkdownString('', true);
  tooltip6.supportHtml = true;
  tooltip6.isTrusted = true;
  // tooltip6.appendMarkdown('\n\n---\n\n');
  tooltip6.appendMarkdown(`[Chrome](command:yutools.visitChromeURL "Chrome")\u00a0\u00a0|\u00a0\u00a0[Firefox](command:yutools.visitFirefoxURL "Firefox")`);
  yutools_status_bar6.tooltip = tooltip6;
	yutools_status_bar6.show();
  context.subscriptions.push(yutools_status_bar6);
  ///////////////////
  ///////////////////

}

export async function deactivate() {
  const shouldUseSelfRun = sidecarUseSelfRun();
  if (!shouldUseSelfRun) {
    // This will crash when self-running
    const serverUrl = getSidecarBinaryURL();
    return await checkOrKillRunningServer(serverUrl);
  }
  return new Promise((resolve) => {
    resolve(true);
  });
}
